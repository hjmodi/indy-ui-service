/**
 * Copyright (C) 2023 Red Hat, Inc. (https://github.com/Commonjava/indy-ui-service)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {PropTypes} from 'prop-types';
import {StoreViewControlPanel as ControlPanel} from '../common/StoreControlPanels.jsx';
import {Hint, PasswordMask} from '../common/Hints.jsx';
import {StoreViewBasicSection as BasicSection} from '../common/StoreBasicSections.jsx';
import {StoreViewCapabilitiesSection} from '../common/StoreCapabilitiesSections.jsx';
import {LoadingSpiner} from '../common/LoadingSpiner.jsx';
// import ViewJsonDebugger from './Debugger.jsx';
import {Filters} from '#utils/Filters.js';
import {Utils} from '#utils/AppUtils.js';
import {TimeUtils} from '#utils/TimeUtils.js';
import {IndyRest} from '#utils/RestClient.js';

const {storeRes, disableRes} = IndyRest;

const HostedAccessSection = ({store})=> <div className="fieldset">
  <div className="detail-field">
    <label>Request Timeout:</label>
    <span>{TimeUtils.secondsToDuration(store.timeout_seconds)}</span>
    <span><Hint hintKey="request_timeout" /></span>
  </div>

  {
    // HTTP Proxy
  }
  <div className="detail-field">
    <span>{Filters.checkmark(store.useProxy)}</span>
    <label>Use Proxy?</label>
  </div>
  {
    store.useProxy &&

      <div className="sub-fields">
        <div className="detail-field">
          <label>Proxy Host:</label>
          <span>{store.proxy_host}</span>
        </div>
        <div className="detail-field">
          <label>Proxy Port:</label>
          <span>{store.proxy_port}</span>
        </div>
      </div>

  }
  {
    // X.509 / auth
  }
  <div className="detail-field">
    <span>{Filters.checkmark(store.useAuth)}</span>
    <label>Use Authentication?</label>
  </div>
  {
      store.useAuth &&
        <div className="sub-fields">
        {
          store.user &&
          <div className="detail-field">
            <label>Username:</label>
            <span>{store.user}</span>
          </div>
        }
        {
          store.password &&
          <div className="detail-field">
            <label>Password:</label>
            <span><PasswordMask /></span>
          </div>
        }
        {
          store.useProxy && store.proxy_user &&
          <div className="detail-field">
            <label>Proxy Username:</label>
            <span>{store.proxy_user}</span>
          </div>
        }
        {
          store.useProxy && store.proxy_password &&
          <div className="detail-field">
            <label>Proxy Password:</label>
            <span><PasswordMask /></span>
          </div>
        }
        </div>

  }
  <div className="detail-field">
      <span>{Filters.checkmark(store.useX509)}</span>
      <label>Use Custom X.509 Configuration?</label>
  </div>
  {
    store.useX509 &&

      <div className="sub-fields">
      {
        store.key_password &&
        <div className="detail-field">
          <label>Client Key Password:</label>
          <span><ap-password-mask></ap-password-mask></span>
        </div>
      }
        <div className="fieldset two-col">
        {
          store.key_certificate_pem &&
          <div className="left-col">
            <div className="textarea-label">
              <label>Client Key</label><span className="hint">(PEM Format)</span>
            </div>
            {
              // 64 columns is the original PEM line-length spec
            }
            <textarea readOnly className="cert" value={store.key_certificate_pem} />
          </div>
        }
        {
          store.server_certificate_pem &&
          <div className="right-col">
            <div className="textarea-label">
              <label>Server Certificate</label><span className="hint">(PEM
                Format)</span>
            </div>
            {
              // 64 columns is the original PEM line-length spec
            }
            <textarea readOnly className="cert" value={store.server_certificate_pem} />
          </div>
        }
        </div>
      </div>

  }
</div>;

HostedAccessSection.propTypes={
  store: PropTypes.object.isRequired
};

export default function HostedView() {
  const [state, setState] = useState({
    store: {},
    raw: {},
    message: ''
  });
  const [loading, setLoading] = useState(true);
  const {packageType, name} = useParams();

  useEffect(()=>{
    setLoading(true);
    const fetchStore = async () => {
      const res = await storeRes.get(packageType, "hosted",name);
      if (res.success){
        const raw = res.result;
        const store = Utils.cloneObj(raw);
        store.disabled = raw.disabled === undefined ? false : raw.disabled;
        store.useX509 = raw.server_certificate_pem || raw.key_certificate_pem;
        store.useProxy = raw.proxy_host && true;
        store.useAuth = store.useProxy && store.proxy_user;
        store.useAuth = store.useAuth || store.user;

        // get Store disablement data
        const timeoutRes = await disableRes.getStoreTimeout(store.packageType, store.type, store.name);
        const newStore = Utils.cloneObj(store);
        if(timeoutRes.success){
          const timeoutData = timeoutRes.result;
          newStore.disableExpiration = timeoutData.expiration;
        }
        // Change state and re-rendering
        setState({
          store: newStore
        });
      }else{
        Utils.logMessage(`Failed to get store data. Error reason: ${res.error.status}->${res.error.message}`);
      }
      setLoading(false);
    };

    fetchStore();
  }, [packageType, name]);

  if (loading) {
    return <LoadingSpiner />;
  }

  const store = state.store;
  if(!Utils.isEmptyObj(store)) {
    return (
      <React.Fragment>
        <div className="control-panel">
          <ControlPanel store={store} />
        </div>

        <div className="content-panel">
          <div className="fieldset-caption">Basics</div>
          <BasicSection store={store} />

          <div className="fieldset-caption">Description</div>
          <div className="fieldset">
            <div className="text-field">
              <textarea readOnly className="text-description" value={store.description} />
            </div>
          </div>

          <StoreViewCapabilitiesSection store={store} />

          <div className="fieldset-caption">Hosted Access</div>
          <HostedAccessSection store={store} />
        </div>
        {
          // <ViewJsonDebugger enableDebug={false} storeJson={store} rawJson={raw} />
        }
      </React.Fragment>
    );
  }
  return null;
}
