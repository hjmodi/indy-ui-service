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
package org.commonjava.indy.service.ui.conf;

import io.smallrye.config.ConfigMapping;
import io.smallrye.config.WithDefault;
import io.smallrye.config.WithName;

import javax.enterprise.context.ApplicationScoped;
import java.util.Optional;

@ApplicationScoped
@ConfigMapping( prefix = "content-browse" )
public interface ContentBrowseConfig
{
    @WithName( "enabled" )
    @WithDefault( "true" )
    Boolean enabled();

    @WithName( "service-url" )
    Optional<String> serviceUrl();

    @WithName( "resource-root" )
    @WithDefault( "META-INF/webui/content-browse/" )
    String resourceRoot();
}
