import React, { Component } from 'react'

class ErrorBoundary extends Component {
   constructor(props) {
      super(props)
      this.state = { hasError: false }
   }

   componentDidCatch(error, info) {
      this.setState({ hasError: true })
      console.error('Error in the component:', error)
   }

   render() {
      if (this.state.hasError) {
         return (
            <p>Something went wrong. Please check the console for details.</p>
         )
      }
      return this.props.children
   }
}

export default ErrorBoundary
