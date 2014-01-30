/*
 * NASA Worldview
 *
 * This code was originally developed at NASA/Goddard Space Flight Center for
 * the Earth Science Data and Information System (ESDIS) project.
 *
 * Copyright (C) 2013 - 2014 United States Government as represented by the
 * Administrator of the National Aeronautics and Space Administration.
 * All Rights Reserved.
 */

buster.testCase("wv.layers.model", {

    config: null,
    models: null,
    model: null,

    setUp: function() {
        this.config = {
            defaults: {
                projection: "geographic"
            },
            projections: {
                "arctic": {},
                "geographic": {}
            },
            layers: {
                "historical_1": {
                    id: "historical_1",
                    startDate: "2000-01-01",
                    endDate: "2002-01-01",
                    group: "overlays"
                },
                "historical_2": {
                    id: "historical_2",
                    startDate: "2001-01-01",
                    endDate: "2003-01-01",
                    group: "overlays"
                },
                "active_1": {
                    id: "active_1",
                    startDate: "2005-01-01",
                    group: "overlays"
                },
                "static": {
                    id: "static",
                    group: "overlays"
                }
            }
        };
        this.models = {};
        this.models.proj = wv.proj.model(this.config);
        this.models.layers = wv.layers.model(this.models, this.config);
        this.model = this.models.layers;
    },

    "Date range with one layer": function() {
        this.model.add("historical_1");
        var range = this.model.dateRange();
        buster.assert.equals(range.start.getTime(),
            new Date(Date.UTC(2000, 0, 1)).getTime());
        buster.assert.equals(range.end.getTime(),
            new Date(Date.UTC(2002, 0, 1)).getTime());
    },

    "Date range with two layers": function() {
        this.model.add("historical_1");
        this.model.add("historical_2");
        var range = this.model.dateRange();
        buster.assert.equals(range.start.getTime(),
            new Date(Date.UTC(2000, 0, 1)).getTime());
        buster.assert.equals(range.end.getTime(),
            new Date(Date.UTC(2003, 0, 1)).getTime());
    },

    "End of date range is today if no end date": function() {
        this.stub(wv.util, "today").returns(new Date(Date.UTC(2010, 0, 1)));
        this.model.add("active_1");
        var range = this.model.dateRange();
        buster.assert.equals(range.start.getTime(),
            new Date(Date.UTC(2005, 0, 1)).getTime());
        buster.assert.equals(range.end.getTime(),
            new Date(Date.UTC(2010, 0, 1)).getTime());
    },

    "No date range with static": function() {
        this.model.add("static");
        buster.refute(this.model.dateRange());
    }

});