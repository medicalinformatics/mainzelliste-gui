/*
based on https://ngx-translate.org/recipes/handle-missing-translations/#building-a-custom-handler
Descriptions for the ID's in the different languages are read from the src/assests/config.json at runtime.
The keys for them are grouped under 'patientPseudonymDescritiptions'.
If there are no descriptions given for a specific key or language, the corresponding key is undefined.
Contrary to ngx-translate's default behavior (to return the key so that it is visible in the frontend in the end),
an empty string shall be returned as the strings are only used as hint labels, i.e. is doesn't really matter if they are empty.
However, for all other keys, the default behavior should be maintained for debugging.
*/

import { Injectable } from '@angular/core';
import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

@Injectable()
export class CustomMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): string {
    // Maintain default behavior if the key is not for a pseudonym description
    return (params.key.startsWith('patientPseudonymDescriptions')) ? '' : params.key;
  }
}