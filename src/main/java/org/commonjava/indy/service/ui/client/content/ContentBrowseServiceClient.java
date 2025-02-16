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
package org.commonjava.indy.service.ui.client.content;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import javax.ws.rs.GET;
import javax.ws.rs.HEAD;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
@Path( "/api/browse/{packageType}/{type: (hosted|group|remote)}/{name}" )
@RegisterRestClient( configKey = "service-api" )
public interface ContentBrowseServiceClient
{

    @HEAD
    @Path( "/{path}" )
    Response headForDirectory( final @PathParam( "packageType" ) String packageType,
                               final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                               final @PathParam( "path" ) String path );

    @GET
    @Path( "/{path}" )
    @Produces( APPLICATION_JSON )
    Response browseDirectory( final @PathParam( "packageType" ) String packageType,
                              final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                              final @PathParam( "path" ) String path, @Context final UriInfo uriInfo );

    @GET
    @Path( "/" )
    @Produces( APPLICATION_JSON )
    Response browseRoot( final @PathParam( "packageType" ) String packageType, final @PathParam( "type" ) String type,
                         final @PathParam( "name" ) String name, @Context final UriInfo uriInfo );

}
