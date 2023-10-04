export const msalConfig = {
    auth: {
      
      // clientId: "a56290ea-23ef-42f6-af3a-4022f54165f2", // test ID   
      // authority: "https://login.microsoftonline.com/mohodyashgmail.onmicrosoft.com", // test auth   
      clientId: "ff992bd7-db23-4b4c-bca3-cd0ab3201b4b",
      authority: "https://login.microsoftonline.com/ithacaedu.onmicrosoft.com", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
      // redirectUri: "http://localhost:3000/",
      redirectUri: "https://anzen.ithaca.edu",
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
  };
  
  // Add scopes here for ID token to be used at Microsoft identity platform endpoints.
  export const loginRequest = {
   scopes: ["User.Read"]
  };
  
  // Add the endpoints here for Microsoft Graph API services you'd like to use.
  export const graphConfig = {
      graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
  };