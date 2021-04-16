import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createRecipe, deleteRecipe, getRecipes, patchRecipe } from '../api/recipes-api'
import Auth from '../auth/Auth'
import { Recipe } from '../types/Recipe'

interface RecipesProps {
  auth: Auth
  history: History
}

interface RecipesState {
  recipes: Recipe[]
  newRecipeName: string
  newRecipeDescription: string
  loadingRecipes: boolean
}

export class Recipes extends React.PureComponent<RecipesProps, RecipesState> {
  state: RecipesState = {
    recipes: [],
    newRecipeName: '',
    newRecipeDescription: '',
    loadingRecipes: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newRecipeName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newRecipeDescription: event.target.value })
  }

  onEditButtonClick = (recipeId: string) => {
    this.props.history.push(`/recipes/${recipeId}/edit`)
  }

  onRecipeCreate = async () => {
    try {
      const newRecipe = await createRecipe(this.props.auth.getIdToken(), {
        name: this.state.newRecipeName,
        description: this.state.newRecipeDescription
      })
      this.setState({
        recipes: [...this.state.recipes, newRecipe],
        newRecipeName: '',
        newRecipeDescription: ''
      })
    } catch {
      alert('Recipe creation failed')
    }
  }

  onRecipeDelete = async (recipeId: string) => {
    try {
      await deleteRecipe(this.props.auth.getIdToken(), recipeId)
      this.setState({
        recipes: this.state.recipes.filter(recipe => recipe.recipeId != recipeId)
      })
    } catch {
      alert('Recipe deletion failed')
    }
  }

  onRecipeCheck = async (pos: number) => {
    try {
      const recipe = this.state.recipes[pos]
      await patchRecipe(this.props.auth.getIdToken(), recipe.recipeId, {
        name: recipe.name,
        description: recipe.description,
        favourite: !recipe.favourite
      })
      this.setState({
        recipes: update(this.state.recipes, {
          [pos]: { favourite: { $set: !recipe.favourite } }
        })
      })
    } catch {
      alert('Adding to favourite failed')
    }
  }

  async componentDidMount() {
    try {
      const recipes = await getRecipes(this.props.auth.getIdToken())
      this.setState({
        recipes,
        loadingRecipes: false
      })
    } catch (e) {
      alert(`Failed to fetch recipes: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Recipes</Header>

        {this.renderCreateRecipeInput()}

        {this.renderRecipes()}
      </div>
    )
  }

  renderCreateRecipeInput() {
    return (
      <Grid columns='equal'>
        <Grid.Column width={6}>
          <Input
            fluid
            placeholder="Name"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={8}>
          <Input
            fluid
            placeholder="Description"
            onChange={this.handleDescriptionChange}
          />
        </Grid.Column>
        <Grid.Column width={2}>
          <Button  
            color="orange"
            onClick={() => this.onRecipeCreate()}>Add recipe
          </Button>
        </Grid.Column>
      </Grid>
    )
  }

  renderRecipes() {
    if (this.state.loadingRecipes) {
      return this.renderLoading()
    }

    return this.renderRecipesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Recipes
        </Loader>
      </Grid.Row>
    )
  }

  renderRecipesList() {
    return (
      <Grid padded>
        {this.state.recipes.map((recipe, pos) => {
          return (
            <Grid.Row key={recipe.recipeId}>
              <Grid.Column width={1} verticalAlign="middle">
              {recipe.favourite && (
                <Icon circular name='heart' />
              )}
              </Grid.Column>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onRecipeCheck(pos)}
                  checked={recipe.favourite}
                />
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
              {!recipe.attachmentUrl && (
                <Image src='https://cdn.pixabay.com/photo/2014/12/21/23/28/recipe-575434_1280.png' size="small" wrapped />
              )}
              {recipe.attachmentUrl && (
                <Image src={recipe.attachmentUrl} size="small" wrapped />
              )}
              </Grid.Column>
              <Grid.Column width={4} verticalAlign="middle">
                {recipe.name}
              </Grid.Column>
              <Grid.Column width={4} floated="right">
                {recipe.description}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                <Button
                  icon
                  basic
                  color="orange"
                  onClick={() => this.onEditButtonClick(recipe.recipeId)}
                >
                  Add image
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  basic
                  color="black"
                  onClick={() => this.onRecipeDelete(recipe.recipeId)}
                >
                  <Icon name="trash alternate" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
