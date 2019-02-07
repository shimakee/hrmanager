<template>
    <div class="marketing">
        <H1>Marketing</H1>
        <form id="csvForm">
            <input type="file" id="csvFile"
            accept=".csv">
            <button type="submit" @click.prevent="submit()">Send</button>
        </form>

        <hr>
        <br>

        <form id="sms">
            <label>Number: </label>
            <input type="text" v-model="sms.tasks[0].to" id="" placeholder="Number">
            <label>Message: </label>
            <textarea v-model="sms.tasks[0].sms" cols="30" rows="10" placeholder="Message"></textarea>

            
            <button type="submit" @click.prevent="sendSMS()">Send</button>
        </form>
    </div>
</template>
<script>
export default {
    data(){
        return{
            csvFile: null,
            sms: {task_num:1,
                tasks:[
                    {tid: 9228384,
                    to: null,
                    sms:""}
                ]}

        }
    }
    ,methods:{
        sendSMS(){
            this.$store.dispatch('sendCommit',  {url: '/marketing/textblast', method:'post', data: this.sms})
                .then(res=>{
                    console.trace(res);
                }).catch(err=>{ 
                    console.trace(err);
                });
        },
        submit(){
            const file = document.querySelector('#csvFile').files;//get file
            this.handleFiles(file);//handle file
        },
        handleFiles(files){
            const file = files[0];
            this.csvFile = file;
            console.log('handling files', this.csvFile);
            if(window.FileReader){
                this.getAsText(files[0]);

            }else{
                console.log('no file reader');
            }
        },
        getAsText(file){
            console.log('reading files as text');
            const reader = new FileReader();

            reader.readAsText(file);

            reader.onload = this.loadHandler;
            reader.onerror = this.errorHandler;
        },
        loadHandler(event){
            const csv = event.target.result;
            
            const data = this.processData(csv);
            this.processOutput(data);
        },
        processData(csv){
            console.log('processing files');
            let rowLine = csv.split(/\r\n|\n/);
            let columnLine = [];

            rowLine.forEach(element => {
                let column = element.split(",");
                columnLine.push(column);
            });

            return columnLine;
        },
        processOutput(data){
            console.log('processing files output');

            const cleanData = this.cleanCSV(data);
            const url = 'http://192.168.254.123/goip_post_sms.html?username=shimakee&password=riffraff'; //TODO

            if(cleanData){
                const textBlastFormatData = this.parseAsTextBlastFormat(cleanData);
                this.sendToTextBlast(textBlastFormatData, url);
            }else{
                console.log('no valid entry in csv');
            }         
        },
        cleanCSV(data){
            console.log('cleaning files as csv to array');
            const length = 2
            const mobileRegex = /^(0?9{1}[0-9]{9})$/;
            let cleanData = [];

            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                if(element.length == 2 && mobileRegex.test(element[0]) && typeof element[1] == 'string'){
                    cleanData.push(element);
                }else{
                    console.log(`invalid entry on row ${i}, either invalid number entry or message.`);
                    continue;
                }  
            }

            return cleanData;
        },
        parseAsTextBlastFormat (data){
            console.log('parsing files from array to object');
            const dataLength = data.length;


            let dataToSend = {
                type:"send-sms",
                task_num: dataLength, 
                tasks:[]
            }

            for (let i = 0; i < dataLength; i++) {
                const element = data[i];

                let num = i+1;
                let tid = {tid: num,
                    to:element[0],
                    sms:element[1]
                }

                dataToSend.tasks.push(tid);
            }

            return dataToSend;
        },
        sendToTextBlast(data, url){
            console.log('sending to text blast', data);

            // data = JSON.stringify(data);

            // $.post(url, data, (res, status)=>{
            //     document.querySelector('#response').innerHTML = status + " : " + res;
            //     console.log(res);
            // });

            //  this.$store.dispatch('sendCommit',  {url: url, method:'post', data: data})
             this.$store.dispatch('sendCommit',  {url: '/marketing/textblast', method:'post', data: data})
                        .then(res=>{
                            console.trace(res);
                        }).catch(err=>{ 
                            console.trace(err);
                        });

            // $.ajax({
            //     type: "POST",
            //     url: url,
            //     crossDomain: true,
            //     data: data,
            //     success: function (res, status) {
            //         console.log(res);
            //         document.querySelector('#response').innerHTML = status + " : " + JSON.stringify(res);
            //     },
            //     error: function (err, status) {
            //         console.log(err);
            //         document.querySelector('#response').innerHTML = status + " : " + JSON.stringify(err);
            //     }
            // });
        },
        errorHandler(event){
            console.log('error has occured');
            console.log('errorhandler event', event);
            // if(event.target.error){
            //     console.log(event.target.error);
            // }
        }
    }
    ,beforeMount(){
        let path = window.location.pathname; //get path
        
        if(path == '/login'){
            this.to = 'signup';
        }else if(path = '/signup'){
            this.to = 'login';
        }
    }
}
</script>
<style scoped>
#sms{
    display: grid;
    /* max-width: 600px; */
    align-content: center;
    justify-content: center;
}
</style>
