Senior Software Engineer · Take-Home Challenge 

# **Vehicle Selection Form** 

A React form to pick a vehicle and upload its service logbook, backed by a Node.js server. 

## **The Task** 

## **Requirements** 

A vehicle has three parts: Make, Model and Badge. The user first selects a Make, then picks from that make's Models. Select Ford and they get Ranger, Falcon and Falcon Ute. 

A third dropdown then offers the Badge. For the Ford Ranger that's Raptor, Raptor X and Wildtrak. Once a Badge is selected, the user can upload their service logbook as a plain text file. 

If the user changes the Make or Model after the Model or Badge is set, clear the dependent selections and load the right options for the new choice. 

Add at least two buttons that quick select common vehicles, pre-filling all three dropdowns. 

### **Demonstration** 

See the finished form in action: https://streamable.com/owc3bh 

## **Submitting** 

Send us a link to a public GitHub repository, or two if you split the front and back end, with a README that tells us how to run it. 

### **Front end** 

React with TypeScript. 

### **Back end** 

Node.js with Express or Koa. 

### **Submission** 

The form POSTs to the server. The response includes the make, model and badge plus the logbook contents, shown on the page. 

## **Vehicle Data** 

Add this to your repo as a hard-coded map, or as a JSON file you read and convert in memory. Your call. 


{
  "ford": {
    "Ranger": ["Raptor", "Raptor X", "Wildtrak"],
    "Falcon": ["XR6", "XR6 Turbo", "XR8"],
    "Falcon Ute": ["XR6", "XR6 Turbo"]
  },
  "bmw": {
    "130d": ["xDrive 26d", "xDrive 30d"],
    "240i": ["xDrive 30d", "xDrive 50d"],
    "320e": ["xDrive 75d", "xDrive 80d", "xDrive 85d"]
  },
  "tesla": {
    "Model 3": ["Performance", "Long Range", "Dual Motor"]
  }
}


## **Ground Rules** 

### **Build it like it's real** 

Don't over-engineer, but show us something close to a realworld system. 

### **Function over polish** 

No set design. Functionality and UX matter more than visual polish. 

### **Sample logbook** 

Any plain text file works. Make your own; we'll test with ours. 

### **AI tooling** 

Use whatever AI tools you normally would. You own every line and we'll ask you to walk us through it. 
