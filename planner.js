const trips = require('./trips');

trips.sort((trip1, trip2) => {
    if (trip1.duration < trip2.duration)
        return -1;
    if (trip1.duration > trip2.duration)
        return 1;
    
    if(trip1.price < trip2.price)
        return -1;
    if(trip1.price > trip2.price)
        return 1;

    return 0;
});

const planTrip = (budget, days) => {
    let activities = getTrips(budget);

    let journey = [];

    if(activities.length / days < 3){
        return -1;
    }

    for(let i = 0; i < days; i++){
        journey[i] = [];
    }

    journey = splitActivities(journey, activities, days);

    let response = [];
    for(let i = 0; i < journey.days.length; i++){
        response.push({
			"day": (i + 1),
            "itinerary": journey.days[i]
        });
    }

    return {
        "schedule": {
            "summary": {
                "budget_spent": journey.budgetSpent,
                "time_in_relocation": journey.travelTime,
                "total_activities": journey.eventCount,
            },
            "days": response
        }
    };
}

const splitActivities = (journey, events, days) => {
    let day = 0;
    let timeSpent = 0;
    let eventsPerDay = Math.floor(events.length / days);
    let eventCount = 0;
    let budgetSpent = 0;
    let travelTime = 0;
    let eventsInDay = 0;

    console.log(eventsPerDay);

    for(let i = 0; i < events.length; i++){
        if(day >= days)
            break;

        journey[day].push({
            start: parseTime(timeSpent % 720),
            activity: {
                "id": events[i].id,
                "duration": events[i].duration,
                "price": events[i].price
            }
        });

        timeSpent += events[i].duration;
        budgetSpent += events[i].price;

        eventCount++;
        eventsInDay++;

        if((timeSpent + 30) % 720 == 0){
            day++;
            eventsInDay = 0;
            timeSpent = 0;
            continue;
        }
        else{
            if(eventsInDay % eventsPerDay == 0){
                day++;
                eventsInDay = 0;
                timeSpent = 0;
                continue;
            }
            else{
                timeSpent += 30;
                travelTime += 30;
            }
        }
    }

    return {
        budgetSpent,
        travelTime,
        eventCount,
        days: journey
    }
}

const getTrips = (budget) => {
    let journey = [];
    let budgetSpent = 0;

    for(let i = 0; i < trips.length; i++){
        if((budget - budgetSpent) >= trips[i].price){
            journey.push(trips[i]);
            budgetSpent += trips[i].price;
        }
    }

    return journey;
}

const parseTime = (time) => {
    let hours = Math.floor(time / 60);
    let mins = time % 60;

    mins = (mins == 0)?"00":mins;

    return `${(10 + hours)}:${mins}`;
}

module.exports = planTrip;