<template>
  <div></div>
</template>

<script>
import firebase from "firebase/app";

export default {
  data() {
    return{
      email: null,
      password: null,
      //passwordRepeat: null,
      validationErrors: []
    };
  },

  methode: {
    resetError(){
      this.validationErrors = [];
    },
    //regist validation
    validate() {
      //reset Errorlist
      this.resetError();

      //email validation
      if(!this.email){
        this.validationErrors.push("email cannot be empty."); 
      }
      if (/.+@.+/.test(this.email) != true) {
        this.validationErrors.push("email must be valid.");
      }

      // password validation
      if (!this.password) {
        this.validationErrors.push("password cannot be empty");
      }
      if (/.{6,}/.test(this.password) != true) {
        this.validationErrors.push(
          "<password must be at least 6 characters long"
        );
      }
      /*
      option! password must be repeated
      if (!(this.password === this.passwordRepeat)) {
        this.validationErrors.push("password did not match");
      }
      */

      // when valid then sign in
      if (this.validationErrors.length <= 0) {
        this.signUp();
      }
    },

    
  }
}
</script>

<style>

</style>