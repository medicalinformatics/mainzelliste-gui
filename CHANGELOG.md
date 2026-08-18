# Changelog
## [1.1.0] - Unreleased
### Upgrade
- upgrade to angular v19
- ensure compatibility with keycloak v26.4
- upgrade keycloak client to v26.2.2
- upgrade ngx translate to v17
- upgrade typescript to v5.5.4
- upgrade tinymce-angular v9.1.1
### Refactor:
- remove angular-material-components/file-input due to outdated Angular dependency
- use papaparse instead of ngx-csv-parser
- remove angular-csv and file-saver packages
### Feature
- Bulk pseudonymization support adding unsure matches
- Support importing policies from a csv file
- Support language url parameter
### Fixed
- In the "Create Patient"-page the Submit button remained disabled after submitting the form with an invalid date of birth.
- Added date of birth validation and error messaging on the Create Patient page.
- Update birthday, consent period, and consent creation date formats when the application language changes
#### Experimental
- A new button to search (dry run) for similar patients in the patient list page.
- A list of all unsure matches with the ability to resolve them.
## [1.0.3] - 2025-10-30
### Fixed
- Upgrade keycloak client to v25.0.6
## [1.0.2] - 2025-09-24
### Fixed
- Dynamically changing locale does not update date formatting
## [1.0.1] - 2025-08-07
### Fixed
- recalculation of consent period end date
## [1.0.0] - 2025-05-09
### Feature
- Patient List with a search filter and csv export.
- Consent management
- Resource based refined permissions
- Multitenancy
- Bulk ID generation
- Bulk pseudonymization
## [0.0.4] - 2024-02-09
### Feature
- 404 page not found
- A button to copy all id contents in the idcard
## [0.0.3] - 2023-12-12
### Fixed
- support idtypes array in CreateIds token
## [0.0.2] - 2023-11-20
### Fixed
- translate patient list paginator
## [0.0.1] - 2023-11-20
- Initial Beta release
