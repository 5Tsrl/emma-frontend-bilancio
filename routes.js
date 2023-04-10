import DashboardLayout from "~theme/DashboardLayout.vue";

const routes = [
    {
		path: "/",
		component: DashboardLayout,
		redirect: "/dashboard",
		children: [
			{
				path: "/bilancio",
				name: "Bilancio Sostenibilità e Esternalità",
				meta: { authorize: ["admin"] },
				// lazy-loaded
				component: pageComponent("index"),
			},						
		]
	}
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
 * **/
function pageComponent(name) {	
	var res;	
		try {
			res = require("@/extra/Bilancio/pages/" + name + ".vue").default;
		} catch (e) {
			console.log("Errore route");
			res = require("./pages/" + name + ".vue").default;
		}	
	return res;
}

export default routes;