/* -*- Mode: JS2; indent-tabs-mode: nil; js2-basic-offset: 4 -*- */
/* vim: set et ts=4 sw=4: */
/*
 * Copyright (c) 2017 Marcus Lundblad
 *
 * GNOME Maps is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by the
 * Free Software Foundation; either version 2 of the License, or (at your
 * option) any later version.
 *
 * GNOME Maps is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with GNOME Maps; if not, see <http://www.gnu.org/licenses/>.
 *
 * Author: Marcus Lundblad <ml@update.uu.se>
 */

 const Lang = imports.lang;

 const GraphHopper = imports.graphHopper;
 const OpenTripPlanner = imports.openTripPlanner;

 const RoutingDelegator = new Lang.Class({
    Name: 'RoutingDelegator',

    _init: function(params) {
        this._query = params.query;
        delete params.query;

        this.parent(params);

        this._transitRouting = false;
        this._graphHopper = new GraphHopper.GraphHopper({ query: this._query });
        this._openTripPlanner =
            new OpenTripPlanner.OpenTripPlanner({ query: this._query,
                                                  graphHopper: this._graphHopper });
        this._query.connect('notify::points', this._onQueryChanged.bind(this));
    },

    get graphHopper() {
        return this._graphHopper;
    },

    get openTripPlanner() {
        return this._openTripPlanner;
    },

    set useTransit(useTransit) {
        this._transitRouting = useTransit;
    },

    _onQueryChanged: function() {
        if (this._query.isValid()) {
            if (this._transitRouting) {
                this._openTripPlanner.fetchFirstResults();
            } else {
                this._graphHopper.fetchRoute(this._query.filledPoints,
                                             this._query.transportation);
            }
        }
    }
 });