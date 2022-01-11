import {Injectable} from '@angular/core';
import {Patient} from "../model/patient";
import {MatTableDataSource} from "@angular/material/table";
import {Id, PatientListService} from "./patient-list.service";

@Injectable({
  providedIn: 'root'
})
// NOTE: Currently this is just a mockup for the real patient service. It currently doesn't do any sync with the mainzelliste.
export class PatientService {

  mockUpData: Array<Patient> = [
    new Patient({
      Nachname: 'Graf',
      Geburtsname: '',
      Vorname: 'Sabine',
      Geburtsdatum: '01.01.2000',
      Wohnort: 'Berlin',
      PLZ: '10115'
    }, [{idType: 'interner Pseudonym', idString: 'MKJH56FR'}, {idType: "externer Pseudonym", idString: "GFTD09BV"}, {idType: "klinischer Pseudonym", idString: "GFTD09BV"}]),
    new Patient({
      Nachname: 'Schmidt',
      Geburtsname: 'Sommer',
      Vorname: 'Laura Marie',
      Geburtsdatum: '19.03.1968',
      Wohnort: 'Hamburg',
      PLZ: '20095'
    }, [{idType: "Pseudonym", idString: 'MN321L09'}, {idType: "externer Pseudonym", idString: "GFTD09BV"}, {idType: "klinischer Pseudonym", idString: "GFTD09BV"}]),
    new Patient({
      Nachname: 'Eckardt',
      Geburtsname: '',
      Vorname: 'Paul',
      Geburtsdatum: '15.05.1980',
      Wohnort: 'Hannover',
      PLZ: '30159'
    }, [{idType: "Pseudonym", idString: "ASDKJU11"}, {idType: "externer Pseudonym", idString: "GFTD09BV"}, {idType: "klinischer Pseudonym", idString: "GFTD09BV"}]),
    new Patient({
      Nachname: 'Friedrich',
      Geburtsname: '',
      Vorname: 'Leonard',
      Geburtsdatum: '23.02.1995',
      Wohnort: 'München',
      PLZ: '80331'
    }, [{idType: "Pseudonym", idString: "CQKF88A0"}, {idType: "externer Pseudonym", idString: "GFTD09BV"}, {idType: "klinischer Pseudonym", idString: "GFTD09BV"}]),
    new Patient({
      Nachname: 'Schulz',
      Geburtsname: 'Haas',
      Vorname: 'Julia',
      Geburtsdatum: '16.03.1983',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "VKLH0876"}]),
    new Patient({
      Nachname: 'Hartmann',
      Geburtsname: 'Dreher',
      Vorname: 'Jasmin',
      Geburtsdatum: '23.02.1992',
      Wohnort: 'Nürnberg',
      PLZ: '90402'
    }, [{idType: "Pseudonym", idString: "YBNPU21"}]),
    new Patient({
      Nachname: 'Hoyer',
      Geburtsname: '',
      Vorname: 'Alexander',
      Geburtsdatum: '19.11.1986',
      Wohnort: 'Wiesbaden',
      PLZ: '55246'
    }, [{idType: "Pseudonym", idString: "JCMR52L"}]),
    new Patient({
      Nachname: 'Kremer',
      Geburtsname: '',
      Vorname: 'Jonas',
      Geburtsdatum: '30.07.1975',
      Wohnort: 'Frankfurt am Main',
      PLZ: '60306'
    }, [{idType: "Pseudonym", idString: "LGF491AS"}]),
    new Patient({
      Nachname: 'Martens',
      Geburtsname: '',
      Vorname: 'Phillip',
      Geburtsdatum: '19.11.1991',
      Wohnort: 'Erlangen',
      PLZ: '91058'
    }, [{idType: "Pseudonym", idString: "XKIIU34A"}]),
    new Patient({
      Nachname: 'Ruppert',
      Geburtsname: '',
      Vorname: 'Mark',
      Geburtsdatum: '19.11.1962',
      Wohnort: 'Landau',
      PLZ: '76829'
    }, [{idType: "Pseudonym", idString: "SQI009TF"}]),
    new Patient({
      Nachname: 'Schaller',
      Geburtsname: 'Lechner',
      Vorname: 'Tamara',
      Geburtsdatum: '25.05.1982',
      Wohnort: 'Konstanz',
      PLZ: '78462'
    }, [{idType: "Pseudonym", idString: "POV762HG"}]),
    new Patient({
      Nachname: 'Schaller',
      Geburtsname: 'Lechner',
      Vorname: 'Tamara',
      Geburtsdatum: '25.05.1982',
      Wohnort: 'Konstanz',
      PLZ: '78462'
    }, [{idType: "Pseudonym", idString: "000FVC1Q"}]),
    new Patient({
      Nachname: 'Schaller',
      Geburtsname: 'Lechner',
      Vorname: 'Tamara',
      Geburtsdatum: '25.05.1982',
      Wohnort: 'Konstanz',
      PLZ: '78462'
    }, [{idType: "Pseudonym", idString: "KTS254XC"}, {idType: "Pseudonym", idString: "GFTD09BV"}]),
    new Patient({
      Nachname: 'Schaller',
      Geburtsname: '',
      Vorname: 'Lucas',
      Geburtsdatum: '15.07.1964',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "GF7L09S2"}]),
    new Patient({
      Nachname: 'Bartz-Hisgen',
      Geburtsname: 'Kremer',
      Vorname: 'Lukas',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Götz',
      Geburtsname: '',
      Vorname: 'Aaron',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Gröner',
      Geburtsname: '',
      Vorname: 'Daniel',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Schulz',
      Geburtsname: '',
      Vorname: 'Denniz',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Springer',
      Geburtsname: '',
      Vorname: 'Denise',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Merckel',
      Geburtsname: '',
      Vorname: 'Markus',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Maier',
      Geburtsname: '',
      Vorname: 'Hans',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Mayer',
      Geburtsname: '',
      Vorname: 'Saskia',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Müller',
      Geburtsname: 'Plenz',
      Vorname: 'Ulrike',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Friedrich',
      Geburtsname: '',
      Vorname: 'Helena',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Wilhelm',
      Geburtsname: '',
      Vorname: 'Jelena',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Sommer',
      Geburtsname: '',
      Vorname: 'Steffanie',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Hartmann',
      Geburtsname: '',
      Vorname: 'Thorsten',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Rudolf',
      Geburtsname: '',
      Vorname: 'Sebastian',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),new Patient({
      Nachname: 'Friedrich',
      Geburtsname: '',
      Vorname: 'Kevin',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Kaiser',
      Geburtsname: '',
      Vorname: 'Jan',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Peter',
      Geburtsname: '',
      Vorname: 'Natascha',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Gumbel',
      Geburtsname: '',
      Vorname: 'Kimberly',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),new Patient({
      Nachname: 'Franz',
      Geburtsname: '',
      Vorname: 'Ingrid',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Hartmann',
      Geburtsname: '',
      Vorname: 'Verena',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),new Patient({
      Nachname: 'Müller',
      Geburtsname: '',
      Vorname: 'Julian',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Schmidt',
      Geburtsname: '',
      Vorname: 'Sara',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),



  ];

  constructor(private patientListService: PatientListService) {
    this.rerenderPatients(patientListService.getPatients())
  }

  rerenderPatients(patients: Promise<Patient[]>, filters?: Array<{ field: string, searchCriteria: string }>) {
    patients.then(patients => {
      // TODO: Find a better way for transforming the single fields to one combined field
      patients.forEach(patient => {
        let birthdate: string = patient.fields.Geburtstag + "." + patient.fields.Geburtsmonat + "." + patient.fields.Geburtsjahr;
        patient.fields.Geburtsdatum = birthdate
        return patient;
      })
      if (filters != undefined) {
        patients = patients.filter((patient) => {
          let matched = false;
          console.log(patient);
          filters.forEach((filter) => {
            console.log(filter);
            if (patient.fields[filter.field].indexOf(filter.searchCriteria) != -1) {
              matched = true;
            }
            console.log(patient.fields[filter.field].indexOf(filter.searchCriteria));
          })
          console.log(matched);
          return matched;
        })
      }
      this.patientsDataSource = new MatTableDataSource<Patient>(patients)
    })
  }

  patientsDataSource: MatTableDataSource<Patient> = new MatTableDataSource<Patient>(this.mockUpData);

  getPatients(filters: Array<{ field: string, searchCriteria: string }>) {
    // TODO: Create proper method to get all patients from a mainzelliste instance
    if (filters.length == 0) {
      this.rerenderPatients(this.patientListService.getPatients());
    } else {
      this.rerenderPatients(this.patientListService.getPatients(), filters);
      }
  }

  createPatient(tmpPatient: Patient): Promise<Patient[]> {
    // TODO: Create proper mainzelliste call for this and return that as result.
    return this.patientListService.addPatient(tmpPatient).then(id => {
      this.rerenderPatients(this.patientListService.getPatients());
      let mappedId = new Id('pid', id.newId, id.tentative, id.uri);
      return this.patientListService.readPatient(mappedId);
    });
  }

  private getMockId(): string {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  deletePatient(patient: Patient): Promise<number> {
    console.log("service is deleting");
    console.log(patient);
    return new Promise((resolve, reject) => {
      let index = this.patientsDataSource.data.findIndex((patientFromArray) => {
        return patientFromArray.ids[0].idString === patient.ids[0].idString;
      });
      console.log(this.patientsDataSource.data[0]);
      console.log(index);
      if (index > -1) {

        this.patientsDataSource.data.splice(index, 1);
        resolve(204);
      }
    })
  }

}
