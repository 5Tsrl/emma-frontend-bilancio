<template>
    <div>
        <b-form>
            <b-form-row>
                <b-col class="flex-grow-1" v-if="loggedUserIsMomaArea || loggedUserIsAdmin || loggedUserIsMomaAzienda">
                    <b-form-group>
                        <label>Azienda</label>
                        <b-form-select v-model="company_id" :options="companies" value-field="id" text-field="name"
                            v-on:change="updateOffices"></b-form-select>
                    </b-form-group>
                </b-col>
                <b-col class="flex-grow-1">
                    <b-form-group>
                        <label>Sede</label>
                        <b-form-select v-model="office_id" :options="offices" value-field="id" text-field="name"></b-form-select>
                    </b-form-group>                   
                </b-col>
                <b-col class="flex-grow-1">
                    <b-form-group>
                        <label>Questionario</label>
                        <b-form-select v-model="survey_id" :options="surveys" value-field="id" text-field="name" v-on:change="retriveImpact"></b-form-select>
                    </b-form-group>                    
                </b-col>
            </b-form-row>
        </b-form>
        <hr />
        <h2>Bilancio di Sostenibilità e Esternalità Monitoraggio</h2>
        <!--Stats cards-->
        <div class="row">
            <div class="col-sm-12 col-md-6 col-xl-6">
                <b-col class="col-4 pl-0"><!-- WIP - filtro per anno confronto -->
                        <b-form-group>
                            <b-form-select size="md" v-model="year" name="year" :options="yearOptions"/>
                        </b-form-group>
                    </b-col>
                <div class="row">
                    <div class="col-sm-6 col-md-6 col-xl-6" v-for="stats in statsCards" :key="stats.title">
                        <stats-card>
                            <div class="icon-big text-center float-left " :class="`icon-${stats.type}`" slot="header">
                                <i :class="stats.icon"></i>
                            </div>
                            <div class="numbers" slot="content">
                                <p>{{ stats.title }}</p>
                                {{ stats.value }} 
                            </div>
                            <div class="stats float-right" slot="footer">
                                <b-button :id="`Informazione-${stats.id}`" variant="primary"><i :class="stats.footerIcon"></i></b-button>
                                <b-popover :show.sync="stats.show" :target="`Informazione-${stats.id}`" title="Informazione">
                                    {{ stats.footerText }}
                                </b-popover>
                            </div>
                        </stats-card>
                    </div>
                </div>
            </div>
            <div class="col-sm-12 col-md-6 col-xl-6">
                <b-col class="col-4 pl-0"><!-- WIP - filtro per anno confronto -->
                        <b-form-group>
                            <b-form-select size="md" v-model="yearCompare" name="year" :options="yearOptions"/>
                        </b-form-group>
                    </b-col>
                <div class="row">
                    <div class="col-sm-6 col-md-6 col-xl-6" v-for="stats in statsCards" :key="stats.title">
                        <stats-card>
                            <div class="icon-big text-center float-left" :class="`icon-${stats.type}`" slot="header">
                                <i :class="stats.icon"></i>
                            </div>
                            <div class="numbers" slot="content">
                                <p>{{ stats.title }}</p>
                                {{ stats.value }} 
                            </div>
                            <div class="stats" slot="footer">
                                <b-button :id="`Informazione-${stats.id}`" variant="primary"><i :class="stats.footerIcon"></i></b-button>
                                <b-popover :show.sync="stats.show" :target="`Informazione-${stats.id}`" title="Informazione">
                                    {{ stats.footerText }}
                                </b-popover>
                            </div>
                        </stats-card>
                    </div>
                </div>
            </div>
        </div>
        
        <h2>Bilancio di Sostenibilità e Esternalità Obbiettivo</h2>
        <!--Stats cards-->
        <div class="row">
            <div class="col-sm-12 col-md-6 col-xl-6">
                <b-col class="col-4 pl-0"><!-- WIP - filtro per anno confronto -->
                        <b-form-group>
                            <b-form-select size="md" v-model="year" name="year" :options="yearOptions"/>
                        </b-form-group>
                    </b-col>
                    <div class="row">
                        <div class="col-sm-6 col-md-6 col-xl-6" v-for="stats in statsCards" :key="stats.title">
                        <stats-card>
                            <div class="icon-big text-center float-left" :class="`icon-${stats.type}`" slot="header">
                                <i :class="stats.icon"></i>
                            </div>
                            <div class="numbers" slot="content">
                                <p>{{ stats.title }}</p>
                                {{ stats.value }}
                            </div>
                            <!-- <div class="stats" slot="footer"><i :class="stats.footerIcon"></i> {{ stats.footerText }}</div> -->
                            <div class="stats" slot="footer">
                                <b-button :id="`info_obj-${stats.id}`" variant="primary"><i :class="stats.footerIcon"></i></b-button>
                            <b-popover :show.sync="stats.show" :target="`info_obj-${stats.id}`" title="Informazion">
                                {{ stats.footerText }}
                            </b-popover>
                            </div>
                        </stats-card>
                    </div>
                </div>
            </div>
            <div class="col-sm-12 col-md-6 col-xl-6">
                <b-col class="col-4 pl-0"><!-- WIP - filtro per anno confronto -->
                        <b-form-group>
                            <b-form-select size="md" v-model="yearCompare" name="year" :options="yearOptions"/>
                        </b-form-group>
                    </b-col>
                    <div class="row">
                        <div class="col-sm-6 col-md-6 col-xl-6" v-for="stats in statsCards" :key="stats.title">
                        <stats-card>
                            <div class="icon-big text-center float-left" :class="`icon-${stats.type}`" slot="header">
                                <i :class="stats.icon"></i>
                            </div>
                            <div class="numbers" slot="content">
                                <p>{{ stats.title }}</p>
                                {{ stats.value }}
                            </div>
                            <!-- <div class="stats" slot="footer"><i :class="stats.footerIcon"></i> {{ stats.footerText }}</div> -->
                            <div class="stats" slot="footer">
                                <b-button :id="`info_obj-${stats.id}`" variant="primary"><i :class="stats.footerIcon"></i></b-button>
                            <b-popover :show.sync="stats.show" :target="`info_obj-${stats.id}`" title="Informazion">
                                {{ stats.footerText }}
                            </b-popover>
                            </div>
                        </stats-card>
                    </div>
                </div>
            </div>
        </div>
        <h3>La CO<sub>2</sub> risparmiata grazie al tuo PSCL equivale a quella assorbita da <b>{{ alberi }}</b> alberi in un
            anno</h3>
        <b-row>
            <b-col>
                <img src="@/assets/img/tree.svg" width="50" v-for="a in alberi" />
            </b-col>
        </b-row>
        <br>
        <p> *Le stime di CO2, NOx, PM10 riportati in questa pagina sotto sono calcolati in base alle formule fornite dal MISE partendo dai dati dichiarati dal Mobility Manager Aziendale. La stima sul numero degli alberi necessari per assorbire la CO2 è fornita da <b-link href="https://www.eea.europa.eu/articles/forests-health-and-climate-change/key-facts/trees-help-tackle-climate-change"><u>Agenzia Europea per l’Ambiente</u></b-link> - (22 Kg CO2) -
Il calcolo delle esternalità deriva dal modello fornito da <b-link href="https://op.europa.eu/en/publication-detail/-/publication/9781f65f-8448-11ea-bf12-01aa75ed71a1"> <u>Handbook on the external costs of transport, </u></b-link>versione 2019, 1.1</p> 
    </div>
</template>

<script>
import Util from "@/mixing/util";
import { StatsCard } from "@/components/index";
import UserService from "@/services/user.service";

const statsCards = [
    {
        id:1,
        type: "success",
        icon: "ti-cloud",
        title: "CO2 Risparmiata",
        value: "0 Kg",
        footerText: "La CO2 è indicatore delle le emissioni climalteranti",
        footerIcon: "ti-info",
        show: false,
    },
    {
        id:2,
        type: "warning",
        icon: "ti-cloud",
        title: "NOx Risparmiati",
        value: "0 Kg",
        footerText: "Gli NOx sono responsabili di malattie respiratorie e causano 90.000 morti all'anno direttamente connessi all'inquinamento atmosferico",
        footerIcon: "ti-info",
        show: false,
    },
    {   
        id:3,
        type: "danger",
        icon: "ti-cloud",
        title: "PM10 Risparmiato",
        value: "0 Kg",
        footerText: "Il PM10 causa diversi effetti sulla salute tra cui molti disturbi collegati all'apparato respiratorio. L’Agenzia Internazionale per la Ricerca sul Cancro (IARC) ha classificato l’inquinamento dell’aria (di cui il particolato atmosferico è un indicatore) nel Gruppo 1, vale a dire tra le sostanze cancerogene per l’uomo.",
        footerIcon: "ti-info",
        show: false,
    },
    {
        id:4,
        type: "primary",
        icon: "ti-money",
        title: "Costi Esterni Risparmiati",
        value: "0 €",
        footerText: "Il traffico genera dei costi che ricadono sulla collettività (metodologia di calcolo utilizzata: Handbook on the external costs of transport)",
        footerIcon: "ti-info",
        show: false,
    },
];

const statsCards_obj = [
    {
        id:1,
        type: "success",
        icon: "ti-cloud",
        title: "CO2 Risparmiata",
        value: "0 Kg",
        footerText: "La CO2 è indicatore delle le emissioni climalteranti",
        footerIcon: "ti-info",
        show: false,
    },
    {
        id:2,
        type: "warning",
        icon: "ti-cloud",
        title: "NOx Risparmiati",
        value: "0 Kg",
        footerText: "Gli NOx sono responsabili di malattie respiratorie e causano 90.000 morti all'anno direttamente connessi all'inquinamento atmosferico",
        footerIcon: "ti-info",
        show: false,
    },
    {
        id:3,
        type: "danger",
        icon: "ti-cloud",
        title: "PM10 Risparmiato",
        value: "0 Kg",
        footerText: "Il PM10 causa diversi effetti sulla salute tra cui molti disturbi collegati all'apparato respiratorio. L’Agenzia Internazionale per la Ricerca sul Cancro (IARC) ha classificato l’inquinamento dell’aria (di cui il particolato atmosferico è un indicatore) nel Gruppo 1, vale a dire tra le sostanze cancerogene per l’uomo.",
        footerIcon: "ti-info",
        show: false,
    },
    {
        id:4,
        type: "primary",
        icon: "ti-money",
        title: "Costi Esterni Risparmiati",
        value: "0 €",
        footerText: "Il traffico genera dei costi che ricadono sulla collettività (metodologia di calcolo utilizzata: Handbook on the external costs of transport)",
        footerIcon: "ti-info",
        show: false,
    },
];

export default {
    name: "BilancioSostenibilità",
    mixins: [Util],
    components: {
        StatsCard,
    },
    data() {
        return {
            statsCards: statsCards,
            statsCards_obj: statsCards_obj,
            alberi: 0,
            company_id: 0,
            companies: [],
            office_id: 0,
            offices: [],
            survey_id: 0,
            surveys: [],
            busy: false,
            impacts: null,
            max:1000,
            value:300,
            year: '',
            yearCompare: '', // WIP - Selezione locale per il confronto tra anni
			yearOptions: [2020, 2021, 2022, 2023, 2024] // WIP - array anni disponibili
            
        };
    },
    computed: {},
    methods: {
        async updateOffices() {
            this.busy = true;
            try {
                this.offices = [];

                if (this.company_id > 0) {
                    let response = await UserService.getOffices(this.company_id);
                    this.offices = response.data.offices;
                }


                if (this.offices.length == 1) {
                    this.office_id = this.offices[0].id;
                    this.surveys = await this.createFilteredSurveysList();
                    if (this.surveys.length == 1) {
                        this.survey_id = this.surveys[0].id;
                    } else {
                        this.survey_id = this.surveys[1].id;
                    }
                } else {
                    this.offices.unshift({
                        id: 0,
                        name: "--- Tutte le sedi  --- ",
                    });
                    this.office_id = this.offices[1].id;
                    this.surveys = await this.createFilteredSurveysList();
                    if (this.surveys.length == 1) {
                        this.survey_id = this.surveys[0].id;
                    } else {
                        this.survey_id = this.surveys[1].id;
                    }
                }

                if (this.company_id > 0) {
                    let response = await UserService.getCompanyType(this.company_id);
                    this.company_type = response.data.data.survey_template;
                }
                this.retriveImpact();
            } catch (e) {
                console.log(e);
            } finally {
                this.busy = false;
            }
        },

        async createFilteredSurveysList() {
            let res;
            console.log("Company, office", this.company_id, this.office_id);
            if (this.company_id > 0 && this.office_id > 0) {
                res = await UserService.getSurveysList(this.company_id, this.office_id);
                this.surveys = [
                    {
                        id: 0,
                        name: "--- Tutti i questionari  --- ",
                    },
                    ...res.data.surveyList,
                ];

            } else {
                this.surveys = [{
                    id: 0,
                    name: "--- Nessun questionario  --- ",
                },];
            }

            return this.surveys;
        },
        retriveImpact: async function () {
			this.busy = true;
			try {
				this.surveys = await this.createFilteredSurveysList();

				localStorage.setItem("bilancio.company", this.company_id);
				localStorage.setItem("bilancio.office", this.office_id);
				localStorage.setItem("bilancio.survey", this.survey_id);

				let result = await UserService.getPsclMeasureImpacts(this.office_id, this.survey_id);

				if (result != null) {
					this.impacts = result.data.impacts;
					this.exists_pscl = true;
                    let totalCO2 = 0;
                    let totalNOx = 0;
                    let totalPM10 = 0;
                    let obj_CO2 = 0;
                    let obj_NOx = 0;
                    let obj_PM10 = 0;

                    for (const key in this.impacts) {
                        // this.impacts[key].forEach(obj => totalCO2 += obj.CO2);
                        // this.impacts[key].forEach(obj => totalNOx += obj.NOx);
                        // this.impacts[key].forEach(obj => totalPM10 += obj.PM10);
                        totalCO2 +=  this.impacts[key].slice(-1)[0].CO2;
                        totalNOx +=  this.impacts[key].slice(-1)[0].NOx;
                        totalPM10 +=  this.impacts[key].slice(-1)[0].PM10;
                        // this.impacts[key].slice(-1).forEach(obj => totalCO2 += obj.CO2);
                        // this.impacts[key].slice(-1).forEach(obj => totalNOx += obj.NOx);
                        // this.impacts[key].slice(-1).forEach(obj => totalPM10 += obj.PM10);
                        obj_CO2 +=this.impacts[key][0].CO2;
                        obj_NOx +=this.impacts[key][0].NOx;
                        obj_PM10 +=this.impacts[key][0].PM10;
                        // .forEach(obj => obj_CO2 += obj.CO2);
                        // this.impacts[key].forEach(obj => obj_NOx += obj.NOx);
                        // this.impacts[key].forEach(obj => obj_PM10 += obj.PM10);
                        
                    }

                    console.log(`Total CO2 emissions: ${totalCO2.toFixed(2)} tons`);	
                    console.log(`obj CO2 emissions: ${obj_CO2.toFixed(2)} kg`);	
                    statsCards[0].value=`${Math.round(totalCO2.toFixed(2))} Kg`;	
                    statsCards[1].value=`${Math.round(totalNOx.toFixed(2))} Kg`;	
                    statsCards[2].value=`${Math.round(totalPM10.toFixed(2))} Kg`;
                    statsCards[3].value=`${(Math.round(((27*totalPM10.toFixed(2))+ (25.4*totalNOx.toFixed(2)))/10)/100)} €`;
                    statsCards_obj[0].value=`${Math.round(obj_CO2.toFixed(2))} Kg`;	
                    statsCards_obj[1].value=`${Math.round(obj_NOx.toFixed(2))} Kg`;	
                    statsCards_obj[2].value=`${Math.round(obj_PM10.toFixed(2))} Kg`;	
                    statsCards_obj[3].value=`${(Math.round(((27*obj_PM10.toFixed(2))+ (25.4*obj_NOx.toFixed(2)))/10)/100)} €`;	
                    this.alberi=Math.round(totalCO2.toFixed(2)/22);
				} else {
					this.exists_bilancio = false;
				}
			} catch (error) {
				console.log(error);
				this.exists_bilancio = false;
			} finally {
				this.busy = false;
			}
		},

        
    },
    async created() {
            this.busy = true;    
            let self = this;        

            try {
                this.year=this.getYear;
                const response = await Promise.all([
                    UserService.getCompanyList(), //0                    
                ]);

                // Aggiungo l'opzione vuota all'inizio
                response[0].data.companies.unshift({
                    id: 0,
                    name: "--- Filtra per azienda  --- ",
                });

                this.offices.unshift({
                    id: 0,
                    name: "--- Seleziona l'azienda  --- ",
                });
                this.companies = response[0].data.companies;                

                if (this.getUserCompany != null) {
                    this.company_id = this.getUserCompany;
                }

                if (localStorage.getItem("bilancio.company") != null) {
                    this.company_id = localStorage.getItem("bilancio.company");
                    await this.updateOffices();
                }

                if (localStorage.getItem("bilancio.office") != null) {
                    this.office_id = localStorage.getItem("bilancio.office");
                }

                this.surveys = await this.createFilteredSurveysList();
                if (localStorage.getItem("bilancio.survey") != null) {
                    this.survey_id = localStorage.getItem("bilancio.survey");
                }

                if (this.$route.query.company_id) {
                    this.company_id = parseInt(this.$route.query.company_id);
                    await this.updateOffices();
                }
                if (this.$route.query.office_id) {
                    this.office_id = parseInt(this.$route.query.office_id);
                }
                if (this.$route.query.survey_id) {
                    this.survey_id = parseInt(this.$route.query.survey_id);
                }
                this.retriveImpact();
                return;
            } catch (e) {
                console.log(e);
            } finally {
                this.busy = false;
            }
        },
};
</script>

<style></style>
