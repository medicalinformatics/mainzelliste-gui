import {Injectable} from '@angular/core';
import {Patient} from "../model/patient";

@Injectable({
  providedIn: 'root'
})
// NOTE: Currently this is just a mockup for the real patient service. It currently doesn't do any sync with the mainzelliste.
export class PatientService {

  patients: Array<Patient> = [
    new Patient({
      nachname: 'Müller',
      geburtsname: '',
      vorname: 'Sara',
      geburtsdatum: '01.01.2000',
      wohnort: 'Berlin',
      plz: '10115'
    }, [{idType: 'pseudonym', idString: 'MKJH56FR'}]),
    new Patient({
      nachname: 'Schmidt',
      geburtsname: 'Sommer',
      vorname: 'Laura',
      geburtsdatum: '19.03.1968',
      wohnort: 'Hamburg',
      plz: '20095'
    }, [{idType: "pseudonym", idString: 'MN321L09'}]),
    new Patient({
      nachname: 'Frank',
      geburtsname: '',
      vorname: 'Tim',
      geburtsdatum: '15.05.1980',
      wohnort: 'Hannover',
      plz: '30159'
    }, [{idType: "pseudonym", idString: "ASDKJU11"}]),
    new Patient({
      nachname: 'Friedrich',
      geburtsname: '',
      vorname: 'Max',
      geburtsdatum: '23.02.1995',
      wohnort: 'München',
      plz: '80331'
    }, [{idType: "pseudonym", idString: "CQKF88A0"}])
  ];

  getPatients(): Promise<Array<Patient>> {
    // TODO: Create proper method to get all patients from a mainzelliste instance
    return new Promise((resolve, reject) => {
      resolve(this.patients);
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

  private getMockId (): string {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < 8; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *
          charactersLength));
    }
    return result;
  };

  deletePatient(patient: Patient): Promise<number> {
    return new Promise((resolve, reject) => {
      let index = this.patients.indexOf(patient);
      if (index > -1) {
        this.patients.splice(index, 1);
      }
    })
  }
}
