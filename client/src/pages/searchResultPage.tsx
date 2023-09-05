import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
	InputAdornment,
	TextField,
	Container,
	InputBaseComponentProps,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchParams } from 'react-router-dom';

import BeerCard from '../components/beerCard';
import Navbar from '../components/navbar';

interface Beer {
	image_url: string;
	id: number;
	name: string;
}

function SearchResultPage() {
	const PER_PAGE = 10;

	const [beerList, setBeerList] = useState<Beer[]>([]);
	// input tag 상태관리, url 상태 관리
	const [query, setQuery] = useState<string>('');
	const [searchQuery, setSearchQuery] = useSearchParams('');

	const url = `https://api.punkapi.com/v2/beers?page=1&per_page=${PER_PAGE}`;
	useEffect(() => {
		axios.get(url).then((res) => {
			setBeerList(res.data);
		});
	}, [url]);

	// input tag 변경 시 query 상태 변경
	const changeQuery = useCallback((event: InputBaseComponentProps) => {
		setQuery(event.target.value);
	}, []);

	// form submit시 useSearchParams hook을 이용해서 url parameter 변경
	const querySubmit = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			const params = {
				q: query,
			};
			setSearchQuery(params);
		},
		[query],
	);

	return (
		<>
			<Navbar />
			<Container>
				<form onSubmit={querySubmit}>
					<TextField
						id="standard-search"
						label="어떤 술을 찾으시나요?"
						type="search"
						variant="standard"
						onChange={changeQuery}
						value={query}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>
				</form>
				<p>{searchQuery.get('q')} 에 대한 검색 결과</p>
			</Container>
			<hr />
			<Container>
				<div>
					{beerList.map((beer) => (
						<BeerCard key={beer.id} beer={beer} />
					))}
				</div>
			</Container>
		</>
	);
}

export default SearchResultPage;
