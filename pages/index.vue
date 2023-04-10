<template>
    <div>
        <b-form>
            <b-form-row>
                <b-col cols="4" v-if="loggedUserIsMomaArea || loggedUserIsAdmin">
                    <b-form-group>
                        <label>Azienda</label>
                        <b-form-select v-model="company_id" :options="companies" value-field="id" text-field="name"
                            v-on:change="updateOffices"></b-form-select>
                    </b-form-group>
                </b-col>
                <b-col cols="4">
                    <b-form-group>
                        <label>Sede</label>
                        <b-form-select v-model="office_id" :options="offices" value-field="id" text-field="name"></b-form-select>
                    </b-form-group>                   
                </b-col>
                <b-col cols="4">
                    <b-form-group>
                        <label>Questionario</label>
                        <b-form-select v-model="survey_id" :options="surveys" value-field="id" text-field="name"></b-form-select>
                    </b-form-group>                    
                </b-col>
            </b-form-row>
        </b-form>
        <hr />
        <h2>Bilancio di Sostenibilità e Esternalità</h2>
        <!--Stats cards-->
        <div class="row">
            <div class="col-md-3 col-xl-3" v-for="stats in statsCards" :key="stats.title">
                <stats-card>
                    <div class="icon-big text-center" :class="`icon-${stats.type}`" slot="header">
                        <i :class="stats.icon"></i>
                    </div>
                    <div class="numbers" slot="content">
                        <p>{{ stats.title }}</p>
                        {{ stats.value }}
                    </div>
                    <div class="stats" slot="footer"><i :class="stats.footerIcon"></i> {{ stats.footerText }}</div>
                </stats-card>
            </div>
        </div>
        <h3>La CO<sub>2</sub> risparmiata grazie al tuo PSCL equivale a quella assorbita da <b>{{ alberi }}</b> alberi in un
            anno</h3>
        <b-row>
            <b-col>
                <img src="@/assets/img/tree.svg" width="100" v-for="a in alberi" />
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Util from "@/mixing/util";
import { StatsCard } from "@/components/index";
import UserService from "@/services/user.service";

const statsCards = [
    {
        type: "success",
        icon: "ti-cloud",
        title: "CO2 Risparmiata",
        value: "13 Ton",
        footerText: "La CO2 è indicatore delle le emissioni climalteranti",
        footerIcon: "ti-info",
    },
    {
        type: "warning",
        icon: "ti-cloud",
        title: "NOx Risparmiati",
        value: "114 Kg",
        footerText: "Gli NOx sono responsabili di malattie respiratorie e causano 90.000 morti all'anno direttamente connessi all'inquinamento atmosferico",
        footerIcon: "ti-info",
    },
    {
        type: "danger",
        icon: "ti-cloud",
        title: "PM10 Risparmiato",
        value: "23 Kg",
        footerText: "Il PM10 causa diversi effetti sulla salute tra cui molti disturbi collegati all'apparato respiratorio. L’Agenzia Internazionale per la Ricerca sul Cancro (IARC) ha classificato l’inquinamento dell’aria (di cui il particolato atmosferico è un indicatore) nel Gruppo 1, vale a dire tra le sostanze cancerogene per l’uomo.",
        footerIcon: "ti-info",
    },
    {
        type: "primary",
        icon: "ti-money",
        title: "Costi Esterni Risparmiati",
        value: "12402 €",
        footerText: "Il traffico genera dei costi che ricadono sulla collettività (metodologia di calcolo utilizzata: Handbook on the external costs of transport)",
        footerIcon: "ti-info",
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
            alberi: 38,
            company_id: 0,
            companies: [],
            office_id: 0,
            offices: [],
            survey_id: 0,
            surveys: [],
            busy: false,
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

        async created() {
            this.busy = true;            

            try {
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

                if (localStorage.getItem("pscl.company") != null) {
                    this.company_id = localStorage.getItem("pscl.company");
                    await this.updateOffices();
                }

                if (localStorage.getItem("pscl.office") != null) {
                    this.office_id = localStorage.getItem("pscl.office");
                }

                this.surveys = await this.createFilteredSurveysList();
                if (localStorage.getItem("pscl.survey") != null) {
                    this.survey_id = localStorage.getItem("pscl.survey");
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

                return;
            } catch (e) {
                console.log(e);
            } finally {
                this.busy = false;
            }
        },
    },
};
</script>

<style></style>
