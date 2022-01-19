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
      Nachname: 'Wiedenmann',
      Geburtsname: 'Steenbock',
      Vorname: 'Gina',
      Geburtsdatum: '01.01.2000',
      Wohnort: 'Bettingen',
      PLZ: '54646'
    }, [{idType: 'interner Pseudonym', idString: 'MKJH56FR'}, {idType: "externer Pseudonym", idString: "GFTD09BV"}, {idType: "klinischer Pseudonym", idString: "GFTD09BV"}]),
    new Patient({
      Nachname: 'Armin',
      Geburtsname: '',
      Vorname: 'Adelfried',
      Geburtsdatum: '19.03.1957',
      Wohnort: 'Pfedelbach',
      PLZ: '74629'
    }, [{idType: "Pseudonym", idString: 'MN321L09'}, {idType: "externer Pseudonym", idString: "GFTD09BV"}, {idType: "klinischer Pseudonym", idString: "GFTD09BV"}]),
    new Patient({
      Nachname: 'Limmer',
      Geburtsname: '',
      Vorname: 'Henrik',
      Geburtsdatum: '15.05.1980',
      Wohnort: 'Heinsberg',
      PLZ: '52525'
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
      Nachname: 'Lemke',
      Geburtsname: 'Lohmann',
      Vorname: 'Ivonne',
      Geburtsdatum: '16.03.1983',
      Wohnort: 'Ergoldsbach',
      PLZ: '84061'
    }, [{idType: "Pseudonym", idString: "VKLH0876"}]),
    new Patient({
      Nachname: 'Dreher',
      Geburtsname: 'Burkhardt',
      Vorname: 'Florine',
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
      Nachname: 'Hacker',
      Geburtsname: '',
      Vorname: 'Leopold',
      Geburtsdatum: '30.07.1975',
      Wohnort: 'Mosbach',
      PLZ: '74821'
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
      Nachname: 'Kühne',
      Geburtsname: '',
      Vorname: 'Clemens',
      Geburtsdatum: '19.11.1962',
      Wohnort: 'Landau',
      PLZ: '76829'
    }, [{idType: "Pseudonym", idString: "SQI009TF"}]),
    new Patient({
      Nachname: 'Steiner',
      Geburtsname: 'Lechner',
      Vorname: 'Judith',
      Geburtsdatum: '25.05.1982',
      Wohnort: 'Konstanz',
      PLZ: '78462'
    }, [{idType: "Pseudonym", idString: "POV762HG"}]),
    new Patient({
      Nachname: 'Steiner',
      Geburtsname: 'Lechner',
      Vorname: 'Judith',
      Geburtsdatum: '25.05.1982',
      Wohnort: 'Leutenthal',
      PLZ: '99439'
    }, [{idType: "Pseudonym", idString: "000FVC1Q"}]),
    new Patient({
      Nachname: 'Schaller',
      Geburtsname: '',
      Vorname: 'Gerhold',
      Geburtsdatum: '15.07.1964',
      Wohnort: 'Prosselheim',
      PLZ: '97279'
    }, [{idType: "Pseudonym", idString: "GF7L09S2"}]),
    new Patient({
      Nachname: 'Bartz-Hisgen',
      Geburtsname: 'Kremer',
      Vorname: 'Lukas',
      Geburtsdatum: '23.06.1999',
      Wohnort: 'Neukrichen b. Oldenburg',
      PLZ: '23779'
    }, [{idType: "Pseudonym", idString: "A235H7VB"}]),
    new Patient({
      Nachname: 'Götz',
      Geburtsname: '',
      Vorname: 'Aaron',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "KJHMNJOP"}]),
    new Patient({
      Nachname: 'Gröner',
      Geburtsname: '',
      Vorname: 'Daniel',
      Geburtsdatum: '01.02.1979',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "H3GFDRES"}]),
    new Patient({
      Nachname: 'Schulz',
      Geburtsname: '',
      Vorname: 'Denniz',
      Geburtsdatum: '01.06.1989',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "OPP5CC12"}]),
    new Patient({
      Nachname: 'Springer',
      Geburtsname: '',
      Vorname: 'Denise',
      Geburtsdatum: '22.02.1965',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "MGFRT45"}]),
    new Patient({
      Nachname: 'Moser',
      Geburtsname: '',
      Vorname: 'Markus',
      Geburtsdatum: '14.04.1967',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "00GTVMJH"}]),
    new Patient({
      Nachname: 'Maier',
      Geburtsname: '',
      Vorname: 'Hans',
      Geburtsdatum: '27.07.1957',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "ERWQ78N0"}]),
    new Patient({
      Nachname: 'Mayer',
      Geburtsname: '',
      Vorname: 'Saskia',
      Geburtsdatum: '24.11.2000',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "DAKK432L"}]),
    new Patient({
      Nachname: 'Müller',
      Geburtsname: 'Plenz',
      Vorname: 'Ulrike',
      Geburtsdatum: '16.02.1979',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "SSX887BKL"}]),
    new Patient({
      Nachname: 'Friedrich',
      Geburtsname: '',
      Vorname: 'Helena',
      Geburtsdatum: '25.05.1968',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "LAEFC45M"}]),
    new Patient({
      Nachname: 'Wilhelm',
      Geburtsname: '',
      Vorname: 'Jelena',
      Geburtsdatum: '10.10.1979',
      Wohnort: 'Eisenberg',
      PLZ: '07607'
    }, [{idType: "Pseudonym", idString: "XCGFR45L"}]),
    new Patient({
      Nachname: 'Sommer',
      Geburtsname: '',
      Vorname: 'Steffanie',
      Geburtsdatum: '21.01.1998',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "BSPL456D"}]),
    new Patient({
      Nachname: 'Hartmann',
      Geburtsname: '',
      Vorname: 'Thorsten',
      Geburtsdatum: '31.03.1986',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "QTBHK431"}]),
    new Patient({
      Nachname: 'Rudolf',
      Geburtsname: '',
      Vorname: 'Sebastian',
      Geburtsdatum: '06.07.1981',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "026HNBFT"}]),new Patient({
      Nachname: 'Moser',
      Geburtsname: '',
      Vorname: 'Matthias',
      Geburtsdatum: '12.08.1973',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "AEHDLBX6"}]),
    new Patient({
      Nachname: 'Kaiser',
      Geburtsname: '',
      Vorname: 'Jan',
      Geburtsdatum: '05.05.1955',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "76FLABZY"}]),
    new Patient({
      Nachname: 'Peter',
      Geburtsname: '',
      Vorname: 'Natascha',
      Geburtsdatum: '13.10.170',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "LDO4A0BC"}]),
    new Patient({
      Nachname: 'Gumbel',
      Geburtsname: '',
      Vorname: 'Kimberly',
      Geburtsdatum: '18.01.1989',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "YOK76BNH"}]),new Patient({
      Nachname: 'Franz',
      Geburtsname: '',
      Vorname: 'Ingrid',
      Geburtsdatum: '03.08.1994',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "09LVYXRS"}]),
    new Patient({
      Nachname: 'Hartmann',
      Geburtsname: '',
      Vorname: 'Verena',
      Geburtsdatum: '23.11.1969',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "09NV6DL2"}]),new Patient({
      Nachname: 'Müller',
      Geburtsname: '',
      Vorname: 'Julian',
      Geburtsdatum: '16.04.1977',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "D432LHGF"}]),
    new Patient({
      Nachname: 'Schmidt',
      Geburtsname: '',
      Vorname: 'Sara',
      Geburtsdatum: '23.09.1997',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "MHG4JNVL"}]),
    new Patient({
      Nachname: 'Moser',
      Geburtsname: '',
      Vorname: 'Veronica',
      Geburtsdatum: '01.10.1975',
      Wohnort: 'Unterweid',
      PLZ: '36452'
    }, [{idType: "Pseudonym", idString: "PLK654MN"}]),
    new Patient({
      Nachname: 'Jansen',
      Geburtsname: '',
      Vorname: 'Diana',
      Geburtsdatum: '13.12.1993',
      Wohnort: 'Dresden',
      PLZ: '01967'
    }, [{idType: "Pseudonym", idString: "DERFLKI8"}]),
    new Patient({
      Nachname: 'Moser',
      Geburtsname: '',
      Vorname: 'Yvonne',
      Geburtsdatum: '14.09.2001',
      Wohnort: 'Unterweid',
      PLZ: '36452'
    }, [{idType: "Pseudonym", idString: "KMNH76FC"}]),



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
