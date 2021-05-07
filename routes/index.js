const trips = require('./trips');
const activities = require('./activities');
const profile = require('./profile');
let userData = require('../data/users');
let tripData = require('../data/trips');
let activityData = require('../data/activities');

const constructorMethod = (app) => {
  app.use('/trips', trips);
  app.use('/activities', activities);
  app.use('/profile', profile);

  app.get('/', async (req, res) => {
    if(!req.session.user) {
      const user = await userData.create("exampleuser", "yourpassword");
      if(user) {
          req.session.user = { username: "exampleuser", _id: user._id.toString() };
          //add trip
          let newTrip = await tripData.create(req.session.user._id, "Hong Kong", new Date("7/13/21"), new Date("7/23/21"));
          if(newTrip) {
            //add activity
            let theInfo = {};
            theInfo.name = "Food Tour";
            theInfo.start_date_time = "2021-07-16 14:00 HKT";
            theInfo.address = "Admiralty MTR Station";
            theInfo.confirmation_number = "HKG25";
            theInfo.image_src = "/public/images/compass_icon.png";

            let created = await activityData.create(req.session.user._id, newTrip._id.toString(), "tour_event", theInfo);
            if(created) {
              req.session.user.trips = await tripData.readAll(req.session.user._id);
            }
          }
      }
    }
    res.redirect('trips');
    return;
  });

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;