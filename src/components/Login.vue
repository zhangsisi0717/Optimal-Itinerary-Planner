<template>
<div>
    <h1 id="login-header">Login</h1>
    <form @submit.prevent class="ui segment large form" id="login-form">
    <div class="field">
        <label>Email</label>
        <input type="email" name="email" placeholder="julie@gmail.com" v-model="email">
    </div>
    <div class="field">
        <label>Password</label>
        <input type="password" name="password" placeholder="" v-model="password">
    </div>
    <div class="field">
        <div class="ui checkbox">
        <input type="checkbox" tabindex="0" class="hidden">
        </div>
    </div>
    <button class="ui button" type="submit" @click="loginAccount">Login</button>
    <div class="ui message red" v-show="message">{{message}}</div>
    </form>
</div>
</template>

<script>
import firebase from "firebase"

export default{
    name: "Login",
    data(){
        return {
            email:"",
            password:"",
            message:""
        }
    },

    methods:{
        loginAccount(){
            if(this.email && this.password){
                this.message = null
                firebase.auth().signInWithEmailAndPassword(this.email,this.password).then(cred=>{
                    this.$router.push({name: "Mapview"}) //success, redirect to route "Mapview"
                }).catch(error=>{
                    this.message = error.message
                })
                this.message = ""
            }
        else{
            this.message = "please fill in all fields"
        }
    }
} 
}
</script>



<style scoped>
#login-form{
    position: relative;
    top: 0px;
    margin:50px;
    left: 400px;
    width:24em
}
#login-header{
    position: relative;
    left: 590px;
    top: 30px;
    color: rgb(61, 61, 61);
}
.ui.button{
    position: relative;
    left: 120px;
    color: white;
    background-color: rgb(41, 165, 130);
}


</style>