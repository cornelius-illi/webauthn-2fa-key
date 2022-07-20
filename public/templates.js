/*
 * @license
 * Copyright 2021 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */

import {
  html,
  render
} from "https://unpkg.com/lit-html@1.0.0/lit-html.js?module";

const notConfiguredHtml = html`
  <p>
    ✖️ Two-factor authentication is not configured (no credentials found). To
    make your account more secure, enable two-factor authentication by adding a
    credential.
  </p>
`;

const configuredHtml = html`
  <div class="db-notification db-notification--informative DB_LIGHT_ALTERNATE">
    <span class="db-notification__icon">
      <svg width="64" height="64"><path d="M33.494 27.965l.006.113v9.48a1 1 0 01-1.993.117l-.007-.116v-8.201l-.372.094a1 1 0 01-.12.022l-.123.008H29.5a1 1 0 01-.117-1.994l.117-.006 1.262-.001 1.495-.373a1 1 0 011.237.857zM32.4 22.45c.78 0 1.42.593 1.493 1.352l.007.144a1.5 1.5 0 01-2.993.152l-.007-.144a1.5 1.5 0 011.5-1.504z" fill="#000"></path><circle stroke="#000" fill="none" stroke-width="2" cx="32" cy="32" r="19"></circle><path stroke="#ec0016" stroke-width="2.1" stroke-linecap="round" d="M28 42h8"></path></svg>
    </span>
    <div class="db-notification__severity">Info</div>
      <span class="db-notification__content" style="font-size: 0.9rem;">
      Two-factor authentication with a security key is configured.
      We recommend you create more than one credential, so that you're not locked
      out of your account in case you lose a security key.</span>
    </div>
`;

const getTitleHtml = credentialsCount => html`
  <div>
    <h3><span class="db-headline db-fs5 t:db-fs6 d:db-fs6">Credential${credentialsCount > 1 ? "s" : ""} (${credentialsCount})</span></h3>
  </div>
`;

function getCredentialHtml(credential, removeEl, renameEl) {
  const { name, credId, publicKey, creationDate } = credential;
  return html`
    <div class="credential-card">
      <div class="credential-name">
        <span class="db-body db-fs5 t:db-fs5 d:db-fs5 db-body--bold">
        ${name
          ? html`
              ${name}
            `
          : html`
              <span class="unnamed">(Unnamed)</span>
            `}
        </span>
      </div>
      <div class="creation-date">
        <span class="db-body db-fs4 t:db-fs4 d:db-fs4 db-body--secondary">
        <div class="info">Created: 
          ${new Date(creationDate).toLocaleDateString()}
          ${new Date(creationDate).toLocaleTimeString()}
        </div>
        </span>
      </div>
      <div class="credential-buttons-container">
        <button
          data-credential-id="${credId}"
          @click="${renameEl}"
          class="db-button db-button--secondary db-button--default db-button--size-s db-button--icon-position-before"
        >
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="db-icon" role="img"><path d="M15.411 3.403l-.096 1.339 1.371.797 1.148-.766a.983.983 0 01.574-.159c1.179 0 3.379 3.832 3.379 5.133 0 .35-.183.717-.542.892l-1.243.606v1.53l1.243.606c.359.175.542.542.542.892 0 1.218-2.149 5.133-3.38 5.133a.983.983 0 01-.573-.16l-1.148-.765-1.37.766.095 1.37c.08 1.137-1.642 1.403-3.411 1.403-1.593 0-3.494-.207-3.411-1.403l.096-1.37-1.371-.766-1.148.766a.983.983 0 01-.574.159c-1.179 0-3.379-3.832-3.379-5.133 0-.35.183-.717.542-.892l1.243-.606v-1.53l-1.243-.606a.987.987 0 01-.542-.892c0-1.338 2.212-5.133 3.411-5.133.16 0 .35.032.542.16l1.148.765 1.37-.797-.095-1.34c-.08-1.115 1.576-1.383 3.228-1.401L12 2c1.594 0 3.496.208 3.411 1.403zM12 4.008c-.446 0-.893.032-1.37.128l.095 1.116c.032.38-.188.738-.51.924L7.792 7.58c-.16.064-.319.127-.51.127s-.386-.058-.542-.16l-.988-.637c-.574.67-1.02 1.467-1.34 2.296l1.02.51c.358.178.575.542.575.892v2.774c0 .382-.23.72-.574.892l-1.02.51c.319.861.765 1.658 1.339 2.328l.988-.638c.156-.1.35-.16.542-.16.191 0 .35.035.51.128l2.423 1.403c.322.186.542.543.51.924l-.096 1.116c.478.096.925.128 1.371.128.446 0 .893-.032 1.37-.128l-.095-1.116c-.032-.38.188-.738.51-.924l2.423-1.403a.961.961 0 01.51-.127c.191 0 .386.058.542.16l.988.637a7.651 7.651 0 001.34-2.327l-1.02-.479a1.02 1.02 0 01-.575-.924v-2.742c0-.382.217-.746.574-.924l1.02-.51c-.319-.83-.765-1.626-1.339-2.296l-.988.638c-.156.1-.35.16-.542.16-.191 0-.35-.064-.51-.128l-2.423-1.403c-.322-.186-.542-.543-.51-.924l.096-1.116A6.865 6.865 0 0012 4.008zM11.985 8a4.02 4.02 0 014.017 4.017c0 2.2-1.786 3.985-4.017 3.985A3.986 3.986 0 018 12.017C8 9.817 9.785 8 11.985 8zM12 10.002a2.02 2.02 0 00-2.008 2.008c0 1.084.924 2.008 2.008 2.008a2.02 2.02 0 002.008-2.008A2 2 0 0012 10.002z" fill="currentColor" fill-rule="evenodd"></path></svg>
          <span>Rename</span>
        </button>
        <button
          data-credential-id="${credId}"
          @click="${removeEl}"
          class="db-button db-button--secondary db-button--default db-button--size-s db-button--icon-position-before"
        >
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="db-icon" role="img"><path d="M12 2a9.99 9.99 0 0110 10 9.99 9.99 0 01-10 10A9.99 9.99 0 012 12 9.99 9.99 0 0112 2zm3.5 5.5c-.25 0-.469.094-.719.313L12 10.592 9.219 7.782c-.188-.187-.5-.281-.719-.281-.469 0-1 .375-1 1 0 .219.063.469.281.719L10.594 12 7.78 14.813a1.026 1.026 0 00-.281.687c0 .469.375 1 1 1 .219 0 .469-.094.688-.281L12 13.406l2.781 2.813c.188.187.5.281.719.281.469 0 1-.375 1-1a.94.94 0 00-.281-.688L13.406 12l2.781-2.781A.999.999 0 0016.5 8.5c0-.531-.438-1-1-1z" fill="currentColor" fill-rule="evenodd"></path></svg>
          <span>Remove</span>
        </button>
      </div>
    </div>
  `;
}

function getCredentialListHtml(credentials, removeEl, renameEl) {
  return html`
    ${credentials.length
      ? html`
          ${configuredHtml} ${getTitleHtml(credentials.length)}
          ${credentials.map(
            cred => html`
              ${getCredentialHtml(cred, removeEl, renameEl)}
            `
          )}
        `
      : notConfiguredHtml}
  `;
}

export { getCredentialListHtml };
