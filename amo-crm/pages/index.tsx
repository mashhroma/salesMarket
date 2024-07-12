import { useEffect, useState } from "react";
import style from "@/styles/main.module.scss";
import axios from "axios";

export default function Home() {
	const [leads, setLeads] = useState<ILeads[]>();
	const [users, setUsers] = useState<IUser[]>();
	const [statuses, setStatuses] = useState<IStatus[]>();

	const [searchValue, setSearchValue] = useState("");

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
		console.log(searchValue);
	};

	const fetchData = async (param = "") => {
		try {
			const [dataLeads, dataUsers, dataStatuses] = await Promise.all([
				axios.get(`http://localhost:3100/api/leads?query=${param}`),
				axios.get("http://localhost:3100/api/users"),
				axios.get("http://localhost:3100/api/leads/pipelines"),
			]);
			setLeads(dataLeads.data.leads);
			setUsers(dataUsers.data.users);
			setStatuses(dataStatuses.data.statuses);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (searchValue.length >= 3) {
			fetchData(searchValue);
		} else {
			fetchData();
		}
	}, [searchValue]);

	return (
		<div className={style.container}>
			<header className={style.header}>
				<h1 className={style.heading}>Сделки из amoCRM</h1>
				<div className={style.search}>
					<input
						type="text"
						name=""
						value={searchValue}
						onChange={handleSearch}
						placeholder="Найти..."
					/>
				</div>
			</header>
			<main className={style.content}>
				<section className={style.sales}>
					<div className={style.titles}>
						<div></div>
						<div>Название</div>
						<div>Бюджет</div>
						<div>Статус</div>
						<div>Ответственный</div>
						<div>Дата создания</div>
					</div>
					{leads?.map((lead: ILeads) => (
						<div className={style.items} key={lead.id}>
							<div></div>
							<div>{lead.name}</div>
							<div>{lead.price}</div>
							<div>
								<span
									style={{
										background: statuses?.find(
											(status: IStatus) => status.id === lead.status_id
										)?.color,
									}}
								>
									{
										statuses?.find(
											(status: IStatus) => status.id === lead.status_id
										)?.name
									}
								</span>
							</div>
							<div>
								{
									users?.find(
										(user: IUser) => user.id === lead.responsible_user_id
									)?.name
								}
							</div>
							<div>
								{lead.created_at
									? new Date(lead.created_at * 1000)?.toLocaleString()
									: ""}
							</div>
						</div>
					))}
				</section>
			</main>
		</div>
	);
}
