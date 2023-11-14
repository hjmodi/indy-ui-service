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

import React from "react";
import {render, screen, cleanup} from '@testing-library/react';
import '@testing-library/jest-dom';
import {LocalURLSection,
  CapabilitiesSection} from "./CommonPageWidget.jsx";
import {hostedOptionLegend} from '../ComponentConstants.js';

// const mockData = {};

afterEach(() => {
  cleanup();
});

describe('CommonPageWidget tests', () => {
  it("LocalURLSection", () => {
    render(<LocalURLSection storeKey="maven:remote:central"/>);
    const keyLink = screen.getByRole("link");
    expect(keyLink).toBeInTheDocument();
    const urlPat = /https?:\/\/.*\/maven\/remote\/central$/ui;
    expect(keyLink.href).toMatch(urlPat);
    expect(screen.getByText(urlPat)).toBeInTheDocument();
  });

  it("CapabilitiesSection",()=>{
    render(<CapabilitiesSection options={hostedOptionLegend}/>);
    expect(screen.getByText(/\s*S\s*/u)).toBeInTheDocument();
    expect(screen.getByText(/\s*R\s*/u)).toBeInTheDocument();
    expect(screen.getByText(/\s*D\s*/u)).toBeInTheDocument();
  });
});
