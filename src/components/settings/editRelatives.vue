<template>
    <div>
        <h2>Relatives</h2>
        <form>
            
            <div class="formGroup">
                <select v-model="formProfile.relationship">
                    <option value="spouse">Spouse</option>
                    <option value="mother">Mother</option>
                    <option value="father">Father</option>
                </select>
            </div>

            <div class="formGroup">
                <select v-model="formProfile.civilStatus">
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="annulled">Annuled</option>
                    <option value="widowed">Widowed</option>
                </select>
            </div>

            <div class="formGroup">
                <label>male</label>
                <input type="radio" v-model="formProfile.gender" value="male">
                <label>female</label>
                <input type="radio" v-model="formProfile.gender" value="female">
            </div>

            <div class="formGroup">
                <label>name:</label>
                <input type="text" v-model="formProfile.name.first" placeholder="first">
                <input type="text" v-model="formProfile.name.middle" placeholder="middle">
                <input v-if="formProfile.gender === 'female' && formProfile.civilStatus !== 'single'"
                    type="text" v-model="formProfile.name.maiden" placeholder="maiden">
                <input type="text" v-model="formProfile.name.last" placeholder="last">
                <input type="text" v-model="formProfile.name.suffix" placeholder="suffix">
            </div>

            <div class="formGroup">
                <input type="date" v-model="formProfile.birthdate">
            </div>
            

            <button @click="submit">Add relative</button>
        </form>
    </div>
</template>

<script>
export default {
    data(){
        return {
            formProfile:{ name:{first: "",
                                middle: "",
                                maiden:"",
                                last: "",
                                suffix: "" },
                        civilStatus: "married",
                        gender: "male",
                        birthdate:"",
                        relationship:'spouse'
            }
        }
    },
    methods:{
        submit(event){
            event.preventDefault();

            //dispatch axios action here
        }
    }
}
</script>
<style scoped>
</style>
