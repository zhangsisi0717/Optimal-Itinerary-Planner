<template>
<div>
    <h1 id="signup-header">Signup</h1>
    <form @submit.prevent="signup" class="ui segment large form" id="signup-form" >
    <div class="field">
        <label>Username</label>
        <input type="text" name="username" placeholder="Julie_Z" v-model="username">
    </div>
    <div class="field">
        <label>Email</label>
        <input type="email" name="email" placeholder="julie@gmail.com" v-model="email">
    </div>
    <div class="field">
        <label>Passsword</label>
        <input type="password" name="password" placeholder="" v-model="password">
    </div>
    <button class="ui button" type="submit">Signup</button>
    <div class="ui message red" v-show="message" >{{message}}</div>
    </form>
</div>
</template>

<script>
import slugify from "slugify"
import db from "@/firebase/init"
import firebase from "firebase"

export default{
    name: "Singup",
    data(){
        return {
            username:"",
            email:"",
            password:"",
            message:"",
            slug:null,
            islogin:false
        }
    },
    methods:{
        signup(){
            if (this.username && this.email && this.password){ //use username as identifier in the firestore, first: npm install slugify 
                this.slug = slugify(this.username,{
                    replacement: '-',
                    remove: /[!@#$%^&*:]/g,
                    lower:true
                })
            // console.log(this.slug)
            let reference = db.collection("users").doc(this.slug) 
            reference.get().then(doc => {
                if (doc.exists){
                    this.message = "username already exists"
                }else{
                    firebase.auth().createUserWithEmailAndPassword(this.email,this.password).then(cred=>{
                        console.log(cred.user)
                        reference.set({
                            username: this.username,
                            // geolocation: null,
                            calculatedItinerary: null,
                            calculatedItineraryHistory:[],
                            UID: cred.user.uid,
                            // loginHistory:[],


                        })
                    }).then(()=>{
                        this.$router.push({name:"Main"}) //after it succeds, go to route "Mapview"
                    }).catch(error=>{
                        this.message = error.message
                        console.log(this.message)
                    })
                    this.message = "success"
                }
            })
            }else{
                this.message = "please fill out all fields"
            }
        }
    }
 

}
</script>



<style scoped>
#signup-form{
    position: relative;
    top: 0px;
    margin:50px;
    left: 400px;
    width:24em
}
#signup-header{
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