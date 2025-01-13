import React,{useEffect} from "react";

const FacebookPage = ()=>{

    return (<>
         <h1>This Page</h1>
         <div class="fb-page" 
       data-href="https://www.facebook.com/YourPageName" 
       data-tabs="timeline" 
       data-width="500" 
       data-height="600" 
       data-small-header="false" 
       data-adapt-container-width="true" 
       data-hide-cover="false" 
       data-show-facepile="true">
    <blockquote cite="https://www.facebook.com/YourPageName" 
                class="fb-xfbml-parse-ignore">
      <a href="https://www.facebook.com/YourPageName">Your Page Name</a>
    </blockquote>
  </div>
    </>);
}
export default FacebookPage;