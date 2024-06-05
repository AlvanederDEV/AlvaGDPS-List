import { fetchList } from '../content.js';
import Spinner from '../components/Spinner.js';



export default {
  components: { Spinner },
  template: /*html*/`
    <main v-if="loading" class="surface">
      <Spinner></Spinner>
    </main>
    <main v-else class="page-submit">
      <h1>¡Manda un record!</h1>
      <div v-if="!sent" id="form-box">
        <form class="form" method="POST">
          <span class="note">* Los asteriscos indican que la pregunta es obligatoria</span>
          <select name="demon-name" id="demon-name" v-model="level">
            <option selected disabled="disabled">Selecciona el nivel*</option>
            <option v-for="([level, err], i) in list" :value="level">{{ i + 1 }}. {{ level?.name }}</option>
          </select>

          <input type="text" v-model="holder" name="record-holder" id="record-holder" placeholder="Nombre de usuario*" required>

          <div id="percentage-div">
            <input type="number" min="0" max="100" v-model="percentage" name="record-percentage-num" id="record-percentage-num" placeholder="Percentage*" required>
            <input type="range" min="0" max="100" v-model="percentage" name="record-percentage" id="record-percentage" placeholder="Percentage*" required>
          </div>
          <input type="text" v-model="footage" name="record-footage" id="record-footage" placeholder="Video*" required>

          <input type="text" v-model="rawfootage" name="record-rawfootage" id="record-rawfootage" placeholder="Raw Footage">


          <span id="span-record-cbf">
            <label for="record-cbf" id="record-cbf-label">Haz click si usaste "Click Between Frames" en tu completion.</label>
            <input type="checkbox" v-model="cbf" name="record-cbf" id="record-cbf">
          </span>

          <textarea name="record-notes" v-model="notes" id="record-notes" placeholder="Numero de Hz (Hercios)"></textarea>

          <button type="button" @click='sendWebhook()'>Enviar</button>


          </form>
          </div>
      <div v-else id="rec-sent">
        <h2 class="success">'¡Record enviado!</h2>
        <button class="success" @click="sent = !sent">Enviar otro record</button>
      </div>
      <h3 id="error">{{ error }}</h3>
    </main>
  `,


  data: () => ({
    list: [],
    loading: true,
    sent: false,
    level: 'Select the level*',
    holder: '',
    footage: '',
    rawfootage: '',
    notes: '',
    percentage: 0,
    cbf: false,
    error: '',
    errortimes: 0,
  }),
  async mounted() {
    // Hide loading spinner
    this.list = await fetchList();


    this.loading = false;
  },

  methods: {
    sendWebhook() {
      if (this.level === 'Select*' || this.holder === '' || this.footage === '' || this.percentage < 0 || this.percentage > 100) {
        this.errortimes += 1
        switch (this.errortimes) {
          case 3:
            this.error = 'Please fill in all required fields. If you are having trouble, please contact us on Discord.'
            return;
          case 6:
            this.error = 'boi what are you doing'
            return;
          case 10:
            this.error = 'ok you are just trolling now'
            return;
          case 20:
            this.error = 'you are just wasting your time'
            return;
          case 40:
            this.error = 'you are wasting our time'
            return;
          case 60:
            this.error = 'please stop lol'
            return;
          case 80:
            this.error = 'ok i am done lol'
            return;
          case 100:
            this.error = 'you clicked the button 100 times, good job.'
            return;
          case 200:
            this.error = 'you clicked the button 200 times, good job.'
            return;
          case 500:
            this.error = 'do you need help?'
            return;
          case 600:
            this.error = 'you might need help.'
            return;
          case 800:
            this.error = 'bro stop what the hell are you doing'
            return;
          case 1000:
            this.error = 'please stop, go outside or something'
            return;
          default:
            break;
        }
        if (this.error === '') {
          this.error = 'Please fill in all required fields.'
        }
        return;
      }
      return new Promise((resolve, reject) => {
        fetch("https://discord.com/api/webhooks/1246890776471011410/WAkUi_4tZukpq1hDnVxb9PqAQCkEdG7nU2v5H3GjModflEGCG0iNSt4SkuBaZYO1Xecp", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: '¡Nuevo Record!',
            embeds: [
              {
                title: '¡Nuevo Record!',
                description: 'New record by ' + this.holder + ' on ' + this.level.name + '.',
                fields: [
                  {
                    name: 'Nivel',
                    value: this.level.name + ' | ' + this.level.id,
                  },
                  {
                    name: 'Usuario',
                    value: this.holder,
                  },
                  {
                    name: 'Porcentaje',
                    value: this.percentage,
                  },
                  {
                    name: 'Video',
                    value: this.footage,
                  },
                  {
                    name: 'Raw footage',
                    value: this.rawfootage || "None",
                  },
                  {
                    name: '¿Uso Click Between Frames?',
                    value: this.cbf,
                  },
                  {
                    name: 'Notas',
                    value: this.notes || "None",
                  },
                ],
              },
            ],

          }),
        })
          .then((response) => {
            if (!response.ok) {
              reject(new Error(`Could not send message: ${response.status}`));
            }
            this.level = 'Select level*'
            this.holder = ''
            this.footage = ''
            this.rawfootage = ''
            this.cbf = ''
            this.notes = ''
            this.sent = true
            this.error = ''
            this.errortimes = 0
            resolve();
          })
          .catch((error) => {
            console.error(error);
            reject(error);
          });
      });
    }

  }
}
