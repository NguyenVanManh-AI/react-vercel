import React from 'react'
import ReactDOM from 'react-dom/client'
import '~/components/GlobalStyle'
import '~/components/icon/MixedIcons'
import '~/components/icon/FontAwesome'
import App from './App'
import reportWebVitals from '~/reportWebVitals'
import { AppProvider } from '~/contexts/AppContext' // Import AppProvider
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'

import store from './redux/store'
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
   <React.StrictMode>
      <AppProvider>
         <Provider store={store}>
            <App />
         </Provider>
      </AppProvider>
   </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
