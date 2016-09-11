console.log("RUNNING sbAdmin.js");

import { Meteor } from 'meteor/meteor';
// import { ReactiveVar } from 'meteor/reactive-var';
// import { ReactiveDict } from 'meteor/reactive-dict';
// import { Lists } from '../../api/lists/lists.js';
// import { Template } from 'meteor/templating';
// import { ActiveRoute } from 'meteor/zimme:active-route';
// import { FlowRouter } from 'meteor/kadira:flow-router';
// import { TAPi18n } from 'meteor/tap:i18n';

// import '../components/loading/loading.js';

import './sbAdmin.html';

/* TODO - Remove the following from Production version */

import "./charts";
import "./tables";
import "./forms";
import "./bootstrapElements";
import "./bootstrapGrid";
import "./blankPage";
import "./indexRTL";

