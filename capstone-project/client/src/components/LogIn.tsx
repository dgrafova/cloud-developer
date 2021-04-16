import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <h1>Welcome to the recipe app, please log in</h1>

        <Button onClick={this.onLogin} size="medium" basic color="orange">
          Log in
        </Button>
      </div>
    )
  }
}
