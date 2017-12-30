package de.team5.super_cute.crocodile.config;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LiveDataConfig {

  public static final int CREATE_STOP_DEFECT_PERCENTAGE = 20;
  public static final int CREATE_VEHICLE_DEFECT_PERCENTAGE = 20;
  public static final int REMOVE_STOP_DEFECT_PERCENTAGE = 10;
  public static final int REMOVE_VEHICLE_DEFECT_PERCENTAGE = 10;
  public static final int DEFECT_FEEDBACK_PERCENTAGE = 5;
  public static final int VALUE_FEEDBACK_PERCENTAGE = 1;

  public static final String STOP_DIRTY = "dirty";
  public static final String STOP_SHELTER_BROKEN = "shelter broken";
  public static final String STOP_BENCH_BROKEN = "bench broken";
  public static final String STOP_ELEVATOR_NOT_WORKING = "elevator not working";
  public static final String STOP_ESCALATOR_NOT_WORKING = "escalator not working";
  public static final String STOP_TICKET_MACHINE_NOT_WORKING = "ticket-machine not working";

  public static final String VEHICLE_DIRTY = "dirty";
  public static final String VEHICLE_WINDOW_BROKEN = "window broken";
  public static final String VEHICLE_CHAIR_BROKEN = "chair broken";
  public static final String VEHICLE_ENGINE_FAILURE = "engine failure";
  public static final String VEHICLE_BRAKE_FAILURE = "brake failure";
  public static final String VEHICLE_AIR_CONDITION_NOT_WORKING = "air-condition not working";

  public static final int SEVERITY_LIMIT_PROBLEMATIC = 6;
  public static final int SEVERITY_LIMIT_CRITICAL = 11;

  public static final int PEOPLE_WAITING_LIMIT_PROBLEMATIC = 301;
  public static final int PEOPLE_WAITING_LIMIT_CRITICAL = 701;
  public static final int DELAY_LIMIT_PROBLEMATIC = 6;
  public static final int DELAY_LIMIT_CRITICAL = 16;
  public static final int LOAD_LIMIT_PROBLEMATIC = 51;
  public static final int LOAD_LIMIT_CRITICAL = 151;
  public static final int TEMPERATURE_LOWER_LIMIT_PROBLEMATIC = 24;
  public static final int TEMPERATURE_UPPER_LIMIT_PROBLEMATIC = 31;
  public static final int TEMPERATURE_LOWER_LIMIT_CRITICAL = 14;
  public static final int TEMPERATURE_UPPER_LIMIT_CRITICAl = 36;

  public static final int PEOPLE_WAITING = 10;
  public static final int LOAD = 20;
  public static final int TEMPERATURE = 21;
  public static final int DELAY = 22;

  public static final List<String> STOP_DEFECTS = new ArrayList<String>() {{
    add(STOP_DIRTY);
    add(STOP_SHELTER_BROKEN);
    add(STOP_BENCH_BROKEN);
    add(STOP_ELEVATOR_NOT_WORKING);
    add(STOP_ESCALATOR_NOT_WORKING);
    add(STOP_TICKET_MACHINE_NOT_WORKING);
  }};

  public static final List<String> VEHICLE_DEFECTS = new ArrayList<String>() {{
    add(VEHICLE_DIRTY);
    add(VEHICLE_WINDOW_BROKEN);
    add(VEHICLE_CHAIR_BROKEN);
    add(VEHICLE_ENGINE_FAILURE);
    add(VEHICLE_BRAKE_FAILURE);
    add(VEHICLE_AIR_CONDITION_NOT_WORKING);
  }};

  public static final Map<String, Integer> STOP_DEFECTS_SEVERITY = new HashMap<String, Integer>() {{
    put(STOP_DIRTY, 2);
    put(STOP_SHELTER_BROKEN, 4);
    put(STOP_BENCH_BROKEN, 3);
    put(STOP_ELEVATOR_NOT_WORKING, 3);
    put(STOP_ESCALATOR_NOT_WORKING, 2);
    put(STOP_TICKET_MACHINE_NOT_WORKING, 4);
  }};

  public static final Map<String, Integer> VEHICLE_DEFECTS_SEVERITY = new HashMap<String, Integer>() {{
    put(VEHICLE_DIRTY, 3);
    put(VEHICLE_WINDOW_BROKEN, 11);
    put(VEHICLE_CHAIR_BROKEN, 2);
    put(VEHICLE_ENGINE_FAILURE, 11);
    put(VEHICLE_BRAKE_FAILURE, 20);
    put(VEHICLE_AIR_CONDITION_NOT_WORKING, 2);
  }};

  //severity for 0-300, 301-700, 701-1000 people waiting
  public static final int[] PEOPLE_WAITING_SEVERITY = new int[]{0, 6, 11};

  //severity for 0-50%, 51-150%, 151-200% load
  public static final int[] LOAD_SEVERITY = new int[]{0, 6, 11};

  //severity for 25-30, 15-24 and 31-35, 5-14 and 36-40 degree temperature
  public static final int[] TEMPERATURE_SEVERITY = new int[]{0, 6, 11};

  //severity for  -5-5, 6-15, 16-60 mins delay
  public static final int[] DELAY_SEVERITY = new int[]{0, 6, 11};

  public static final Map<String, List<String>> STOP_DEFECT_FEEDBACK = new HashMap<String, List<String>>() {{
    put(STOP_DIRTY, new ArrayList<String>() {{
      add("This stop is unbelievable dirty! Please send someone to clean it...");
      add("I have never seen such a dirty station!!1!");
      add("So much garbage at this stop... :(");
    }});
    put(STOP_SHELTER_BROKEN, new ArrayList<String>() {{
      add("Shelter roof is leaky! There was rain inside");
      add("Quite windy here... Build new shelter please.");
      add("The whole shelter broke down!!! I had to stand in the rain for around 30mins!!!!");
    }});
    put(STOP_BENCH_BROKEN, new ArrayList<String>() {{
      add("Wow i had to stand for 2 Minutes");
      add("0/10 seat comfort");
      add("Only 2 seats not spiky from broken metal");
    }});
    put(STOP_ELEVATOR_NOT_WORKING, new ArrayList<String>() {{
      add("Stuck in elevator for 2h!!");
      add("Had to carry my old grandma upstairs because the damn elevator was broken!!11!1!");
      add("Elevator music not that good :/");
    }});
    put(STOP_ESCALATOR_NOT_WORKING, new ArrayList<String>() {{
      add("Had to carry 10 beverage crates to the next station because the escalator was not working...");
      add("The escalator escalated :D");
      add("Escalator was moving in the wrong direction!");
    }});
    put(STOP_TICKET_MACHINE_NOT_WORKING, new ArrayList<String>() {{
      add("I drove without a ticket because ticket-machine was not working...");
      add("HOW AM I SUPPOSED TO PAY FOR YOUR SERVICES IF THE TICKET MACHINE IS NOT WORKING????!!!!");
      add("Ticket-machine is not KIV verified i guess...");
    }});
  }};

  public static final Map<String, List<String>> VEHICLE_DEFECT_FEEDBACK = new HashMap<String, List<String>>() {{
    put(VEHICLE_DIRTY, new ArrayList<String>() {{
      add("white fluffy stuff in the corner... never use ur service again");
      add("so dirty!");
      add("Better clean your vehicles!!");
    }});
    put(VEHICLE_WINDOW_BROKEN, new ArrayList<String>() {{
      add("The whole window is broken!!!");
      add("I was just sitting here when someone broke the window to get out of the vehicle :O");
      add("I just leaned against the window and suddenly it broke!");
    }});
    put(VEHICLE_CHAIR_BROKEN, new ArrayList<String>() {{
      add("too little seats that are not broken! :(");
      add("In our vehicle everybody has to stand because all seats are ripped up!!!");
      add("Next time I'll bring my own chair! -.-");
    }});
    put(VEHICLE_ENGINE_FAILURE, new ArrayList<String>() {{
      add("Had to walk the rest of the way, because the vehicle wasn´t able to drive anymore...");
      add("WHENN IS THIOS DAMNN THINGF GOING TO CARRY ON?????!!11!");
      add("I´m stuck here for 2h already! Do your job and fix it!");
    }});
    put(VEHICLE_BRAKE_FAILURE, new ArrayList<String>() {{
      add("The vehicle full of people rushed into the final stop. I´m the only alive!");
      add("Vehicle is driving circles for 1 hour now!");
      add("The operator just made an announcement that the brake aren´t working anymore. ARE WE GOING TO DIE NOW?");
    }});
    put(VEHICLE_AIR_CONDITION_NOT_WORKING, new ArrayList<String>() {{
      add("The air is so stale :(");
      add("Please let some air into your vehicles!");
      add("Impossible to breathe in here...");
    }});
  }};

  public static final Map<Integer, List<List<String>>> VALUE_FEEDBACK = new HashMap<Integer, List<List<String>>>() {{
    put(PEOPLE_WAITING, new ArrayList<List<String>>() {{
      //messages for low peopleWaiting
      add(new ArrayList<String>() {{
        add("Completely deserted here...");
        add("I was the only one waiting here");
        add("Enough room for all my luggage :)");
      }}); // fine
      //messages for medium peopleWaiting
      add(new ArrayList<String>() {{
        add("It´s getting crowded here!");
        add("So many people waiting here 0.o");
        add("It´s ok waiting with so many people.");
      }}); // problematic
      //messages for high peopleWaiting
      add(new ArrayList<String>() {{
        add("is there a soccer game? Or why so many people??");
        add("Feels like Oktoberfest time :D");
        add("The whole platform is full of zombies staring at their IPhones!");
      }}); // critical
    }});
    put(LOAD, new ArrayList<List<String>>() {{
      add(new ArrayList<String>() {{
        add("I was the only person in the vehicle! Apart from the driver...");
        add("I saw a vehicle driving by with just the driver inside. Such a waste of money!");
        add("Seems like no one´s traveling today :)");
      }});
      add(new ArrayList<String>() {{
        add("Had a nice drive!");
        add("It´s getting crowded in here :D");
        add("Vehicle so full, I had no seat! Dislike!");
      }});
      add(new ArrayList<String>() {{
        add("No room for privacy :/");
        add("Feels like a disco in here xDDDDD");
        add("U could throw a party with all these people in here!!!");
      }});
    }});
    put(TEMPERATURE, new ArrayList<List<String>>() {{
      add(new ArrayList<String>() {{
        add("Had a nice drive!");
        add("Nice temperature, tho.");
        add("I drove the public transport with my thermometer today. The most optimal temperature! :)");
      }});
      add(new ArrayList<String>() {{
        add("too hot -.-'");
        add("I froze the whole ride!!");
        add("Nice vehicle, bad temperature!");
      }});
      add(new ArrayList<String>() {{
        add("It was so cold Olaf wanted a hug!");
        add("Colder than in my refrigerator :O");
        add("hotter than outside!!!");
      }});
    }});
    put(DELAY, new ArrayList<List<String>>() {{
      add(new ArrayList<String>() {{
        add("The vehicle was surprisingly punctual today :)");
        add("Wow i got one connecting train earlier!");
        add("Came into my meeting in time. :)");
      }});
      add(new ArrayList<String>() {{
        add("Exhausted from running to my connection train.........");
        add("Missed my meeting :/");
        add("5 minutes too late for my wedding. Thx Smart-City-Operator!");
      }});
      add(new ArrayList<String>() {{
        add("More delay that the Deutsche Bahn!!!!");
        add("Stood here for an hour!!!!11!");
        add("So many vehicles, but not mine...");
        add("Tumbleweed tumbling over the train tracks.");
      }});
    }});
  }};
}
