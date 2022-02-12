import { SiriusConfig } from './../interfaces/sirius.config';
import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Fach } from '../interfaces/fach';

const siriusConfigPath: string = 'sirius.config.json';
const onSiriusConfigFileChannel: string = 'siriusConfigFile';
const faecherFilePath: string = 'faecher.json';
const onGetFileChannel: string = 'fileRequester';
const cacheVariable: string = 'faecher';

@Injectable({
  providedIn: 'root'
})
export class FaecherManagerService {
  private siriusConfig: SiriusConfig = { directories: [] };

  public faecher: Fach[] = [{
    id: "d",
    name: "Deutsch",
    description: "Literatur und deutsche Sprache",
    files: [],
    tasks: [],
    notes: '',
    einheiten: [
      {
        topic: 'Dramen',
        description: '',
        notes: '',
        tasks: [],
        files: []
      }
    ]
  }, {
    id: "m",
    name: "Mathematik",
    description: "Untersuchung und Abstraktion komplexer Probleme",
    files: [],
    tasks: [{
      description: 'Task 1',
      closed: true
    }],
    notes: '',
    einheiten: [
      {
        topic: 'Trigonometrie',
        description: '',
        notes: '',
        tasks: [],
        files: []
      },
      {
        topic: 'Analysis',
        description: 'Kurvendiskussion, Funktionen, ...',
        notes: '',
        tasks: [],
        files: []
      }
    ]
  }];

  constructor(private readonly electron: ElectronService) {
    //load the sirius.config.json file
    /*if (this.electron.isElectronApp) {
      this.loadSiriusConfig();
    }*/

    //setTimeout(() => this.loadFromCache(), 2000)
    this.loadFromCache();
  }

  public loadFromCache() {
    console.log("I'm here already!");
    let cache = localStorage[cacheVariable];
    this.faecher = cache ? JSON.parse(cache) : [];
  }

  public saveInCache() {
    localStorage[cacheVariable] = JSON.stringify(this.faecher);
  }

  private loadSiriusConfig() {
    this.electron.ipcRenderer.once(onSiriusConfigFileChannel, (event, arg) => {
      if (arg) {
        try {
          this.siriusConfig = JSON.parse(arg as string) as SiriusConfig;
        }
        catch {
          this.createSiriusConfig();
        }
      }
      else {
        this.createSiriusConfig();
      }

      console.log(this.siriusConfig);

      this.loadFaecher();
    });
    this.electron.ipcRenderer.sendSync('readFile', [ siriusConfigPath, onSiriusConfigFileChannel ]);
  }

  private loadFaecher() {
    this.getFile(faecherFilePath, (file: string | Buffer | undefined) => {
      if (file) {
        this.faecher = JSON.parse(file as string);
      }
      else {
        this.createFaecher();
      }
    });
  }

  private createFaecher() {
    this.faecher = [];
    this.postFile(faecherFilePath, JSON.stringify(this.faecher));
  }

  private createSiriusConfig() {
    this.siriusConfig = {
      directories: [
        'C:\\Users\\Julian Alber\\OneDrive\\Sirius\\',
        ''
      ]
    };

    this.electron.ipcRenderer.sendSync('writeFile', [ siriusConfigPath, JSON.stringify(this.siriusConfig) ]);
  }

  public save(): void {
    let str = JSON.stringify(this.faecher);
    for (let path of this.siriusConfig.directories) {
      this.electron.ipcRenderer.sendSync('writeFile', [ path + faecherFilePath, str ])
    }
  }

  public postFile(path: string, content: string): void {
    for (let d of this.siriusConfig.directories) {
      this.electron.ipcRenderer.sendSync('writeFile', [ d + path, content ]);
    }
  }

  public getFile(path: string, callback: (file: string | Buffer | undefined) => void): void {
    let foundSomething: boolean = false;
    let counter2: number = 0;// will count how many response were received in order to make a last callback
    for (let counter: number = 0; foundSomething || counter < this.siriusConfig.directories.length; counter++) {
      this.electron.ipcRenderer.once(onGetFileChannel, (event, arg) => {
        counter2++;
        if (!foundSomething && arg) {
          foundSomething = true;

          try {
            callback(arg as string | Buffer);
          }
          catch { }
        }

        if (counter2 == this.siriusConfig.directories.length && !foundSomething) {
          callback(undefined);// make last callback
        }
      })
      this.electron.ipcRenderer.sendSync('readFile', [ this.siriusConfig.directories[counter] + path, onGetFileChannel ]);
      
    }
  }

  public getFachById(id: string): Fach | undefined {
    for (let fach of this.faecher) {
      if (fach.id == id) return fach;
    }
    return undefined;
  }

  public addFach(fach: Fach): void {
    this.faecher.push(fach);
  }

  public addFachWithData(id: string, name: string, description: string): void {
    this.addFach({
      id: id,
      name: name,
      description: description,
      notes: '',
      tasks: [],
      einheiten: [],
      files: []
    })
  }
}
