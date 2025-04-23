import {Injectable} from '@angular/core';
import {Patient} from "../model/patient";
import {PatientListService, ReadPatientsResponse} from "./patient-list.service";
import {Field} from "../model/field";
import {catchError, map, mergeMap} from "rxjs/operators";
import {Observable, of, throwError} from "rxjs";
import {MainzellisteError} from "../model/mainzelliste-error.model";
import {ErrorMessages} from "../error/error-messages";
import {Id} from "../model/id";
import {Operation} from "../model/tenant";
import { TokenData } from '../model/token-data';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SessionService } from './session.service';
import { PatientList } from '../model/patientlist';
import { AppConfigService } from '../app-config.service';

@Injectable({
  providedIn: 'root'
})
// TODO: Try to remove this one and completly replace with patient-list.service.ts
// NOTE: Currently this is just a mockup for the real patient service. It currently doesn't do any sync with the mainzelliste.
export class PatientService {

  mockUpData: Array<Patient> = [
    new Patient({
      Nachname: 'Wiedenmann',
      Geburtsname: 'Steenbock',
      Vorname: 'Gina',
      Geburtsdatum: '01.01.2000',
      Wohnort: 'Bettingen',
      PLZ: '54646'
    }, [new Id("interner Pseudonym", "MKJH56FR"), new Id("externer Pseudonym", "GFTD09BV"), new Id("klinischer Pseudonym", "GFTD09BV")]),
    new Patient({
      Nachname: 'Armin',
      Geburtsname: '',
      Vorname: 'Adelfried',
      Geburtsdatum: '19.03.1957',
      Wohnort: 'Pfedelbach',
      PLZ: '74629'
    }, [new Id("Pseudonym", "MN321L09"), new Id("externer Pseudonym", "GFTD09BV"), new Id("klinischer Pseudonym", "GFTD09BV")]),
    new Patient({
      Nachname: 'Limmer',
      Geburtsname: '',
      Vorname: 'Henrik',
      Geburtsdatum: '15.05.1980',
      Wohnort: 'Heinsberg',
      PLZ: '52525'
    }, [new Id("Pseudonym", "ASDKJU11"), new Id("externer Pseudonym", "GFTD09BV"), new Id("klinischer Pseudonym", "GFTD09BV")]),
    new Patient({
      Nachname: 'Friedrich',
      Geburtsname: '',
      Vorname: 'Leonard',
      Geburtsdatum: '23.02.1995',
      Wohnort: 'München',
      PLZ: '80331'
    }, [new Id("Pseudonym", "CQKF88A0"), new Id("externer Pseudonym", "GFTD09BV"), new Id("klinischer Pseudonym", "GFTD09BV")]),
    new Patient({
      Nachname: 'Lemke',
      Geburtsname: 'Lohmann',
      Vorname: 'Ivonne',
      Geburtsdatum: '16.03.1983',
      Wohnort: 'Ergoldsbach',
      PLZ: '84061'
    }, [new Id("Pseudonym", "VKLH0876")]),
    new Patient({
      Nachname: 'Dreher',
      Geburtsname: 'Burkhardt',
      Vorname: 'Florine',
      Geburtsdatum: '23.02.1992',
      Wohnort: 'Nürnberg',
      PLZ: '90402'
    }, [new Id("Pseudonym", "YBNPU21")]),
    new Patient({
      Nachname: 'Hoyer',
      Geburtsname: '',
      Vorname: 'Alexander',
      Geburtsdatum: '19.11.1986',
      Wohnort: 'Wiesbaden',
      PLZ: '55246'
    }, [new Id("Pseudonym", "JCMR52L")]),
    new Patient({
      Nachname: 'Hacker',
      Geburtsname: '',
      Vorname: 'Leopold',
      Geburtsdatum: '30.07.1975',
      Wohnort: 'Mosbach',
      PLZ: '74821'
    }, [new Id("Pseudonym", "LGF491AS")]),
    new Patient({
      Nachname: 'Martens',
      Geburtsname: '',
      Vorname: 'Phillip',
      Geburtsdatum: '19.11.1991',
      Wohnort: 'Erlangen',
      PLZ: '91058'
    }, [new Id("Pseudonym", "XKIIU34A")]),
    new Patient({
      Nachname: 'Kühne',
      Geburtsname: '',
      Vorname: 'Clemens',
      Geburtsdatum: '19.11.1962',
      Wohnort: 'Landau',
      PLZ: '76829'
    }, [new Id("Pseudonym", "SQI009TF")]),
    new Patient({
      Nachname: 'Steiner',
      Geburtsname: 'Lechner',
      Vorname: 'Judith',
      Geburtsdatum: '25.05.1982',
      Wohnort: 'Konstanz',
      PLZ: '78462'
    }, [new Id("Pseudonym", "POV762HG")]),
    new Patient({
      Nachname: 'Steiner',
      Geburtsname: 'Lechner',
      Vorname: 'Judith',
      Geburtsdatum: '25.05.1982',
      Wohnort: 'Leutenthal',
      PLZ: '99439'
    }, [new Id("Pseudonym", "000FVC1Q")]),
    new Patient({
      Nachname: 'Schaller',
      Geburtsname: '',
      Vorname: 'Gerhold',
      Geburtsdatum: '15.07.1964',
      Wohnort: 'Prosselheim',
      PLZ: '97279'
    }, [new Id("Pseudonym", "GF7L09S2")]),
    new Patient({
      Nachname: 'Bartz-Hisgen',
      Geburtsname: 'Kremer',
      Vorname: 'Lukas',
      Geburtsdatum: '23.06.1999',
      Wohnort: 'Neukrichen b. Oldenburg',
      PLZ: '23779'
    }, [new Id("Pseudonym", "A235H7VB")]),
    new Patient({
      Nachname: 'Götz',
      Geburtsname: '',
      Vorname: 'Aaron',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "KJHMNJOP")]),
    new Patient({
      Nachname: 'Gröner',
      Geburtsname: '',
      Vorname: 'Daniel',
      Geburtsdatum: '01.02.1979',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "H3GFDRES")]),
    new Patient({
      Nachname: 'Schulz',
      Geburtsname: '',
      Vorname: 'Denniz',
      Geburtsdatum: '01.06.1989',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "OPP5CC12")]),
    new Patient({
      Nachname: 'Springer',
      Geburtsname: '',
      Vorname: 'Denise',
      Geburtsdatum: '22.02.1965',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "MGFRT45")]),
    new Patient({
      Nachname: 'Moser',
      Geburtsname: '',
      Vorname: 'Markus',
      Geburtsdatum: '14.04.1967',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "00GTVMJH")]),
    new Patient({
      Nachname: 'Maier',
      Geburtsname: '',
      Vorname: 'Hans',
      Geburtsdatum: '27.07.1957',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "ERWQ78N0")]),
    new Patient({
      Nachname: 'Mayer',
      Geburtsname: '',
      Vorname: 'Saskia',
      Geburtsdatum: '24.11.2000',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "DAKK432L")]),
    new Patient({
      Nachname: 'Müller',
      Geburtsname: 'Plenz',
      Vorname: 'Ulrike',
      Geburtsdatum: '16.02.1979',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "SSX887BKL")]),
    new Patient({
      Nachname: 'Friedrich',
      Geburtsname: '',
      Vorname: 'Helena',
      Geburtsdatum: '25.05.1968',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "LAEFC45M")]),
    new Patient({
      Nachname: 'Wilhelm',
      Geburtsname: '',
      Vorname: 'Jelena',
      Geburtsdatum: '10.10.1979',
      Wohnort: 'Eisenberg',
      PLZ: '07607'
    }, [new Id("Pseudonym", "XCGFR45L")]),
    new Patient({
      Nachname: 'Sommer',
      Geburtsname: '',
      Vorname: 'Steffanie',
      Geburtsdatum: '21.01.1998',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "BSPL456D")]),
    new Patient({
      Nachname: 'Hartmann',
      Geburtsname: '',
      Vorname: 'Thorsten',
      Geburtsdatum: '31.03.1986',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "QTBHK431")]),
    new Patient({
      Nachname: 'Rudolf',
      Geburtsname: '',
      Vorname: 'Sebastian',
      Geburtsdatum: '06.07.1981',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "026HNBFT")]),new Patient({
      Nachname: 'Moser',
      Geburtsname: '',
      Vorname: 'Matthias',
      Geburtsdatum: '12.08.1973',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "AEHDLBX6")]),
    new Patient({
      Nachname: 'Kaiser',
      Geburtsname: '',
      Vorname: 'Jan',
      Geburtsdatum: '05.05.1955',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "76FLABZY")]),
    new Patient({
      Nachname: 'Peter',
      Geburtsname: '',
      Vorname: 'Natascha',
      Geburtsdatum: '13.10.170',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "LDO4A0BC")]),
    new Patient({
      Nachname: 'Gumbel',
      Geburtsname: '',
      Vorname: 'Kimberly',
      Geburtsdatum: '18.01.1989',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "YOK76BNH")]),new Patient({
      Nachname: 'Franz',
      Geburtsname: '',
      Vorname: 'Ingrid',
      Geburtsdatum: '03.08.1994',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "09LVYXRS")]),
    new Patient({
      Nachname: 'Hartmann',
      Geburtsname: '',
      Vorname: 'Verena',
      Geburtsdatum: '23.11.1969',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "09NV6DL2")]),new Patient({
      Nachname: 'Müller',
      Geburtsname: '',
      Vorname: 'Julian',
      Geburtsdatum: '16.04.1977',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "D432LHGF")]),
    new Patient({
      Nachname: 'Schmidt',
      Geburtsname: '',
      Vorname: 'Sara',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "MHG4JNVL")]),
    new Patient({
      Nachname: 'Moser',
      Geburtsname: '',
      Vorname: 'Veronica',
      Geburtsdatum: '01.10.1975',
      Wohnort: 'Unterweid',
      PLZ: '36452'
    }, [new Id("Pseudonym", "PLK654MN")]),
    new Patient({
      Nachname: 'Jansen',
      Geburtsname: '',
      Vorname: 'Diana',
      Geburtsdatum: '13.12.1993',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [new Id("Pseudonym", "DERFLKI8")]),
    new Patient({
      Nachname: 'Moser',
      Geburtsname: '',
      Vorname: 'Yvonne',
      Geburtsdatum: '14.09.2001',
      Wohnort: 'Unterweid',
      PLZ: '36452'
    }, [new Id("Pseudonym", "KMNH76FC")])
  ];
  private patientList: PatientList;

  constructor(
    private patientListService: PatientListService,
    private httpClient: HttpClient,
    private configService: AppConfigService,
    private sessionService: SessionService) {
      this.patientList = this.configService.data[0];
  }

  getDisplayPatients(filters: Array<{ field: string, fields: string[], searchCriteria: string, isIdType: boolean }>,
                     pageIndex: number, pageSize: number,
                     tenants?: { id: string, name: string, idTypes: string[] }[]): Observable<ReadPatientsResponse> {
    return this.patientListService.getPatients(filters, pageIndex + 1, pageSize).pipe(
      map((response: ReadPatientsResponse): ReadPatientsResponse => {
          let displayPatients: Patient[]
          if (response.patients.length == 0) {
            displayPatients = this.patientListService.isDebugModeEnabled() ? this.mockUpData : [];
          } else {
            displayPatients = response.patients
            .filter(p => p.ids != undefined)
            .map(patient => this.patientListService.convertToDisplayPatient(patient, true, tenants));
          }
          // override patients
          response.patients = displayPatients;
          return response;
        }
      )
    )
  }

   createPatient(patient: Patient, idTypes: string[], sureness: boolean): Observable<Id> {
    if (idTypes == undefined || idTypes.length == 0) {
      throw new MainzellisteError(ErrorMessages.CREATE_PATIENT_MISSING_ID_TYPE);
    }
    return this.patientListService.addPatient(patient, idTypes, sureness);
  }

  deletePatient(patient: Patient){
     return this.patientListService.deletePatient(patient);
  }

  getConfiguredFields(operation: Operation): Array<Field> {
    return this.patientListService.getConfiguredFields(operation);
  }

  getConfigureIdTypes(): Array<string> {
    return this.patientListService.getAllIdTypes("R");
  }

  getSecondaryIdentities(idType: string, idString:string){
     const data: TokenData = {
          "patientId": {
            "idType": idType,
            "idString": idString
          }
        }
        console.log('getSecondaryIdentities called');
        return this.sessionService.createToken("readIdentities", data).pipe(
          mergeMap(token => {
            console.log('Token received:', token);
            return this.readSecondaryIdentities(token.id);
          }),
          catchError((error) => {
            console.error('Error occurred in getSecondaryIdentities:', error);
            if (error.status >= 400 && error.status < 500) {
              return throwError(() => new Error("failed to fetch identities"));
            } else {
              return throwError(() => new Error("failed to fetch identities"));
            }
          })
        );
      }
    
      readSecondaryIdentities(tokenId: string | undefined) {
        return this.httpClient.get(this.patientList.url + "/patients/identities", {
          params: new HttpParams().set('tokenId', tokenId ?? ''),
          observe: 'response'
        }).pipe(
          mergeMap(response => {
            if (response.status == 200) {
              return this.getPatients(response.body);
            } else {
              return throwError(() => new Error("failed to fetch identities"));
            }
          }),
          catchError((error) => {
            console.error('Error occurred in readSecondaryIdentities:', error);
            if (error.status >= 400 && error.status < 500) {
              return throwError(() => new Error("failed to fetch identities"));
            } else {
              return throwError(() => new Error("failed to fetch identities"));
            }
          })
        );
      }
    
      getPatients(response: any) {
        type Identity = {
          fields: { [key: string]: string },
          id: Id,
          main: boolean
        };
        let identities: Identity[] = [];
        let patients: Patient[] = [];
        identities = response as Identity[] ?? [];
        patients = identities.filter(i => i.main == false).map(i => new Patient(i.fields, [i.id]));
        return of({ data: patients });
      }
    
}


