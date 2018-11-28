import React, { Component } from "react";
import axios from "axios";
import loadingGif from "./media/loading.gif";
import "./App.css";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stuff: [],
			selectedCard: null,
			favoritesList: [],
			selectedName: "",
			searchTerm: ""
		};
		this.getDataFromUrl = this.getDataFromUrl.bind(this);
		this.postUserCardToTheServer = this.postUserCardToTheServer.bind(this);
		this.getCardsFromServer = this.getCardsFromServer.bind(this);
		this.updateCardOnServer = this.updateCardOnServer.bind(this);
		this.search = this.search.bind(this);
	}

	componentDidMount() {
		this.getDataFromUrl();
		this.getCardsFromServer();
	}

	setCard(card) {
		this.setState({
			selectedCard: card.imageUrl,
			selectedName: card.name
		});
	}

	getDataFromUrl() {
		axios.get("https://api.pokemontcg.io/v1/cards").then((response) => {
			this.setState({
				stuff: response.data.cards
			});
		});
	}

	getCardsFromServer() {
		axios.get("/api/favorites").then((response) => {
			console.log(response);
			this.setState({
				favoritesList: response.data
			});
		});
	}

	postUserCardToTheServer() {
		const savedCard = {
			imageUrl: this.state.selectedCard,
			name: this.state.selectedName
		};
		axios.post("/api/favorites", savedCard).then((response) => {
			this.setState({
				favoritesList: response.data
			});
		});
	}

	updateCardOnServer(id) {
		const updatedCard = {
			imageUrl: this.state.selectedCard,
			name: this.state.selectedName
		};

		axios.put(`/api/favorites/${id}`, updatedCard).then((response) => {
			this.setState({
				favoritesList: response.data
			});
		});
	}

	deleteCardFromServer(id) {
		console.log(id);
		axios.delete(`/api/favorites/${id}`).then((response) => {
			this.setState({
				favoritesList: response.data
			});
		});
	}

	search(value) {
		axios.get(`/api/search?name=${value}`).then((response) => {
			this.setState({
				favoritesList: response.data,
				searchTerm: value
			});
		});
	}

	render() {
		const { stuff, selectedCard, favoritesList } = this.state;

		const pokeCards = stuff.length ? (
			stuff.map((card) => {
				return (
					<img
						key={card.imageUrl}
						onClick={() => {
							this.setCard(card);
						}}
						src={card.imageUrl}
					/>
				);
			})
		) : (
			<img src={loadingGif} />
		);

		const myFavorites = favoritesList.map((card) => {
			return (
				<span key={card.id}>
					<img src={card.imageUrl} />
					<button onClick={() => this.deleteCardFromServer(card.id)}>
						delete
					</button>
					<button onClick={() => this.updateCardOnServer(card.id)}>
						update with selected
					</button>
				</span>
			);
		});

		return (
			<div className="App">
				<div>
					<span>
						Search
						<input
							value={this.state.searchTerm}
							onChange={(e) => {
								this.search(e.target.value);
							}}
						/>
					</span>
					<div>{myFavorites}</div>
					<div>
						<img src={selectedCard} />
						<div>
							<button onClick={this.postUserCardToTheServer}>
								Add
							</button>
						</div>
					</div>
				</div>
				{pokeCards}
			</div>
		);
	}
}

export default App;
