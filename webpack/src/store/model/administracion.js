// Modelo Administración
import axios from 'axios'

const module = {
  state:{
    apiGetUserDataRunning: false,
    administracion:{
      en_mantenimiento: false,
    },
    working:false
  },
  getters: {
    administracion: state => state.administracion,
    working: state => state.working
  },
  mutations: {
    updateAdminState(state,payload) {
      state.administracion = payload;
    }
  },
  actions: {
    getAdministracionData:function({commit,state},payload){
      state.working = true;
      state.apiGetUserDataRunning = true;

      const curl = axios.create({
        baseURL: process.env.SIEP_API_GW_INGRESS,
      });

      // curl.interceptors.request.use (
      //   function (config) {
      //     config.headers.Authorization = `Bearer ${state.authToken}`;
      //     config.headers['X-CAKE-APP'] = 'Chinwenwencha';
      //     return config;
      //   },
      //   function (error) {
      //     return Promise.reject (error);
      //   }
      // );
      // En todas las request envia el token por header
      curl.defaults.headers.common['Authorization'] = `Bearer ${state.authToken}`;
      curl.defaults.headers.common['X-CAKE-APP'] = 'Chinwenwencha';
      curl.get('/api/v1/administracion',{
        params: {request_from:'siep_admin',stage: process.env.NODE_ENV},
      })
        .then(function (response) {
          // handle success
          commit('updateAdminState',response.data);
          state.apiGetUserDataRunning = false;
          state.working = false;
        })
        .catch(function (error) {
          // handle error
          let alerta = {
            show: true,
            class: "error",
            message: error
          };
          store.dispatch('toggleAlertMessage',alerta);
          state.apiGetUserDataRunning = false;
          state.working = false;
        });
    },
    updateAdministracionData:function(form){
      const curl = axios.create({
        baseURL: process.env.SIEP_API_GW_INGRESS
      });
      // Header con token
      curl.defaults.headers.common['Authorization'] = `Bearer ${state.authToken}`;
      curl.post('/api/v1/administracion',state.authApi.persona.id,payload)
          .then(function (response) {
            // handle success
            if(response.data.updated)
            {
              if(payload.familiar)
              {
                dispatch('apiGetUserData');
              } else {
                // Si es familiar crea el familiar
                if(payload.familiar){
                  payload.persona_id = state.authApi.persona.id;
                  dispatch("apiCreateFamiliar",payload);
                }else{

                }
                router.push({
                  path: '/inscripciones/finalizar'
                });
              }
            } else {
              let alerta = {
                show: true,
                class: "error",
                message: response.data.error
              };
              store.dispatch('toggleAlertMessage',alerta);
              console.log(response.data);
            }
          })
          .catch(function (error) {
            // handle error
            let alerta = {
              show: true,
              class: "error",
              message: response.data.error
            };
            store.dispatch('toggleAlertMessage',alerta);
            console.log(error);
          });
    }
  }
};


export default module