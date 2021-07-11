<template>
    <div>
    <section id="header">
        <h1 id="title">Optimal Itinerary Planner</h1>
    </section>
    <div class="ui secondary menu" id="menu">
        <i class="home icon"></i>
        <a class="ui item"><router-link :to="{ name: 'Mapview'}"> Home</router-link></a>
        <i class="history icon" v-show="user"></i>
        <a class="ui item" v-show="user" id="history">History</a>
        <div class="right menu">
            <i class="user plus icon" id="user-plus"></i>
            <a class= "ui item"><router-link :to="{ name: 'Signup'}">Signup</router-link></a>
            <a class= "ui item" ><router-link :to="{ name: 'Login'}" v-if="!user">Login</router-link></a>
            <i class="user circle icon" id="user-circle-icon" v-if="user"></i>
            <a class="ui item" @click="logoutAccount" v-if="user"><router-link :to="{ name: 'Login'}">Logout</router-link></a>
        </div>
    </div>
    
    </div>
</template>

<script>
import firebase from "firebase"

export default{
    name:"NaviBar",
    data(){
        return {
            user:null
        }
    },

    methods:{
          logoutAccount(){
            console.log(this.user)
            firebase.auth().signOut().then(()=>{
              this.$router.push({name:"Login"}) //go back to route "Login"
            })
          }
    },

    created(){
          console.log("run created")
          firebase.auth().onAuthStateChanged(user=>{
            if(user){
                console.log(this.user)
              this.user = user

            }
            else{
              console.log("user is null")
              this.user = null
            }
          })
        },
    
    mounted(){console.log("Navibar mounted")}
}
</script>

<style scoped>
#header{
    background-color: rgb(41, 165, 130);
    height: 50px;
}

#menu{
    background-color: rgb(41, 165, 130);
    position: relative;
    top: -15px
}

#title{
    color: white;
    position: relative;
    top:10px;
    font-family:Verdana, Geneva, Tahoma, sans-serif
}
.home.icon{
    position: relative;
    top: 13px;
    left: 10px;
    color: white;
}
.history.icon{
    position: relative;
    top: 13px;
    left: 15px;
    color: white;
}

#history{
  position: relative;
  top:1px;
}
#home-item{
    color: white;
}

.ui.item{
    color:white
}
a {
  color: #FFF;
}
#user-circle-icon,#user-plus{
  position: relative;
  top:12px;
  right: -10px;
  color: white;
}

/* #user-plus{
  position: relative;
  top:12px;
  right: -10px;
  color: white;

} */

</style>
