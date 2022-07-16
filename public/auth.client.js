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

import { decodeServerOptions, encodeCredential } from "./encoding.js";

const authStatuses = Object.freeze({
  NEED_SECOND_FACTOR: "needSecondFactor",
  COMPLETE: "complete"
});

async function _fetch(path, method, payload = "") {
  const headers = {
    "X-Requested-With": "XMLHttpRequest"
  };
  if (payload && !(payload instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(payload);
  }
  const res = await fetch(path, {
    method,
    credentials: "same-origin",
    headers: headers,
    ...(method !== "GET" && { body: payload })
  });
  if (res.status === 200) {
    // Server authentication succeeded
    return res.json();
  } else {
    // Server authentication failed
    const result = await res.json();
    throw result.error;
  }
}

async function registerCredential() {
  // Fetch the credential creation options from the backend
  const credentialCreationOptionsFromServer = await _fetch(
    "/auth/credential-options",
    "POST"
  );
  // Decode the credential creation options
  const credentialCreationOptions = decodeServerOptions(
    credentialCreationOptionsFromServer
  );
  // Create a credential via the browser API; this will prompt the user to touch their security key or tap a button on their phone
  const credential = await navigator.credentials.create({
    publicKey: {
      ...credentialCreationOptions,
    }
  });
  // Encode the newly created credential to send it to the backend
  const encodedCredential = encodeCredential(credential);
  // Send the encoded credential to the backend for storage
  return await _fetch("/auth/credential", "POST", encodedCredential);
}

async function renameCredential(credId, newName) {
  const params = new URLSearchParams({
    credId,
    name: newName
  });
  return _fetch(`/auth/credential?${params}`, "PUT");
}

async function removeCredential(credId) {
  const params = new URLSearchParams({
    credId
  });
  return _fetch(`/auth/credential?${params}`, "DELETE");
}

async function authenticateTwoFactor() {
  // 📍📍📍 ADD CODE HERE 📍📍📍
}

export {
  authStatuses,
  _fetch,
  registerCredential,
  renameCredential,
  removeCredential,
  authenticateTwoFactor
};
