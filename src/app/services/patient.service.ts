import {Injectable} from '@angular/core';
import {Patient} from "../model/patient";

@Injectable({
  providedIn: 'root'
})
// NOTE: Currently this is just a mockup for the real patient service. It currently doesn't do any sync with the mainzelliste.
export class PatientService {

  patients: Array<Patient> = [
    new Patient({
      Nachname: 'Graf',
      Geburtsname: '',
      Vorname: 'Sabine',
      Geburtsdatum: '01.01.2000',
      Wohnort: 'Berlin',
      PLZ: '10115'
    }, [{idType: 'Pseudonym', idString: 'MKJH56FR'}]),
    new Patient({
      Nachname: 'Schmidt',
      Geburtsname: 'Sommer',
      Vorname: 'Laura Marie',
      Geburtsdatum: '19.03.1968',
      Wohnort: 'Hamburg',
      PLZ: '20095'
    }, [{idType: "Pseudonym", idString: 'MN321L09'}]),
    new Patient({
      Nachname: 'Eckardt',
      Geburtsname: '',
      Vorname: 'Paul',
      Geburtsdatum: '15.05.1980',
      Wohnort: 'Hannover',
      PLZ: '30159'
    }, [{idType: "Pseudonym", idString: "ASDKJU11"}]),
    new Patient({
      Nachname: 'Friedrich',
      Geburtsname: '',
      Vorname: 'Leonard',
      Geburtsdatum: '23.02.1995',
      Wohnort: 'München',
      PLZ: '80331'
    }, [{idType: "Pseudonym", idString: "CQKF88A0"}]),
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
    }, [{idType: "Pseudonym", idString: "KTS254XC"}]),
    new Patient({
      Nachname: 'Plenz',
      Geburtsname: '',
      Vorname: 'Ralf',
      Geburtsdatum: '15.07.1964',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "GF7L09S2"}]),
    new Patient({
      Nachname: 'Appel',
      Geburtsname: 'Plenz',
      Vorname: 'Jana',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
  ];

  getPatients(filters: Array<{ field: string, searchCriteria: string }>): Promise<Array<Patient>> {
    // TODO: Create proper method to get all patients from a mainzelliste instance
    return new Promise((resolve, reject) => {
      if (filters.length == 0) {
        resolve(this.patients)
      } else {
        let filterPatients = this.patients.filter((patient) => {
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
        });
        resolve(filterPatients);
      }
    });
  }

  createPatient(tmpPatient: Patient): Promise<number> {
    // TODO: Create proper mainzelliste call for this and return that as result.
    return new Promise((resolve, reject) => {
      tmpPatient.ids.push({idType: "pseudonym", idString: this.getMockId()});
      this.patients.push(tmpPatient);
      resolve(200);
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
  };

  deletePatient(patient: Patient): Promise<number> {
    console.log("service is deleting");
    console.log(patient);
    return new Promise((resolve, reject) => {
      let index = this.patients.findIndex((patientFromArray) => {
        return patientFromArray.ids[0].idString === patient.ids[0].idString;
      });
      console.log(this.patients[0]);
      console.log(index);
      if (index > -1) {

        this.patients.splice(index, 1);
        resolve(204);
      }
    })
  }


}
