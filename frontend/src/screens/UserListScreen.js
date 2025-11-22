import {
	Box,
	Button,
	Flex,
	Heading,
	Table,
	Text,
	Tooltip,
	Stack,
	Badge,
	Separator,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import {
	IoPencilSharp,
	IoTrashBinSharp,
} from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { deleteUser, listUsers } from '../actions/userActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const UserListScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { loading, error, users } = useSelector((state) => state.userList);
	const { userInfo } = useSelector((state) => state.userLogin);
	const { success: successDelete } = useSelector((state) => state.userDelete);

	useEffect(() => {
		if (userInfo && userInfo.isAdmin) {
			dispatch(listUsers());
		} else {
			navigate('/login');
		}
	}, [dispatch, navigate, userInfo, successDelete]);

	const deleteHandler = (id) => {
		if (window.confirm('Are you sure you want to delete this user?')) {
			dispatch(deleteUser(id));
		}
	};

	return (
		<>
			<Heading
				as="h1"
				fontSize={{ base: '2xl', md: '3xl' }}
				fontWeight="bold"
				mb="6"
				color="gray.700"
			>
				User Management
			</Heading>

			{loading ? (
				<Loader />
			) : error ? (
				<Message type="error">{error}</Message>
			) : (
				<Box
					bg="white"
					rounded="lg"
					shadow="md"
					p={{ base: '4', md: '6' }}
				>
					{/* Desktop View */}
					<Box hideBelow="md">
						<Table.Root size="md">
							<Table.Header bg="gray.100">
								<Table.Row>
									<Table.ColumnHeader>ID</Table.ColumnHeader>
									<Table.ColumnHeader>NAME</Table.ColumnHeader>
									<Table.ColumnHeader>EMAIL</Table.ColumnHeader>
									<Table.ColumnHeader textAlign="center">ROLE</Table.ColumnHeader>
									<Table.ColumnHeader textAlign="center">ACTIONS</Table.ColumnHeader>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{users.map((user) => (
									<Table.Row key={user._id}>
										<Table.Cell fontSize="sm" color="gray.600">
											{user._id}
										</Table.Cell>
										<Table.Cell fontWeight="medium" color="gray.700">
											{user.name}
										</Table.Cell>
										<Table.Cell fontSize="sm" color="gray.600">
											<a href={`mailto:${user.email}`}>{user.email}</a>
										</Table.Cell>
										<Table.Cell textAlign="center">
											<Badge
												colorPalette={user.isAdmin ? 'green' : 'red'}
												px="3"
												py="1"
												borderRadius="full"
											>
												{user.isAdmin ? 'Admin' : 'User'}
											</Badge>
										</Table.Cell>
										<Table.Cell textAlign="center">
											<Flex justify="center" gap="3">
												<Tooltip.Root>
													<Tooltip.Trigger>
														<Button
															asChild
															colorPalette="blue"
															size="sm"
														>
															<RouterLink to={`/admin/user/${user._id}/edit`}>
																<IoPencilSharp style={{ marginRight: '4px' }} />
																Edit
															</RouterLink>
														</Button>
													</Tooltip.Trigger>
													<Tooltip.Positioner>
														<Tooltip.Content>Edit User</Tooltip.Content>
													</Tooltip.Positioner>
												</Tooltip.Root>

												<Tooltip.Root>
													<Tooltip.Trigger>
														<Button
															colorPalette="red"
															size="sm"
															onClick={() => deleteHandler(user._id)}
														>
															<IoTrashBinSharp style={{ marginRight: '4px' }} />
															Delete
														</Button>
													</Tooltip.Trigger>
													<Tooltip.Positioner>
														<Tooltip.Content>Delete User</Tooltip.Content>
													</Tooltip.Positioner>
												</Tooltip.Root>
											</Flex>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table.Root>
					</Box>

					{/* Mobile View */}
					<Box hideFrom="md">
						<Stack gap="4">
							{users.map((user) => (
								<Box
									key={user._id}
									borderWidth="1px"
									rounded="md"
									shadow="sm"
									p="4"
									bg="gray.50"
								>
									<Flex justify="space-between" align="center" mb="2">
										<Text fontSize="xs" color="gray.500">
											{user._id}
										</Text>
										<Flex gap="2">
											<Tooltip.Root>
												<Tooltip.Trigger>
													<Button
														asChild
														colorPalette="blue"
														size="sm"
														variant="outline"
													>
														<RouterLink to={`/admin/user/${user._id}/edit`}>
															<IoPencilSharp />
														</RouterLink>
													</Button>
												</Tooltip.Trigger>
												<Tooltip.Positioner>
													<Tooltip.Content>Edit User</Tooltip.Content>
												</Tooltip.Positioner>
											</Tooltip.Root>

											<Tooltip.Root>
												<Tooltip.Trigger>
													<Button
														colorPalette="red"
														size="sm"
														variant="outline"
														onClick={() => deleteHandler(user._id)}
													>
														<IoTrashBinSharp />
													</Button>
												</Tooltip.Trigger>
												<Tooltip.Positioner>
													<Tooltip.Content>Delete User</Tooltip.Content>
												</Tooltip.Positioner>
											</Tooltip.Root>
										</Flex>
									</Flex>

									<Separator mb="3" />

									<Stack gap="1">
										<Text fontWeight="bold" color="gray.700">
											{user.name}
										</Text>
										<Text fontSize="sm" color="gray.600">
											<a href={`mailto:${user.email}`}>{user.email}</a>
										</Text>
										<Badge
											mt="2"
											colorPalette={user.isAdmin ? 'green' : 'red'}
											alignSelf="start"
										>
											{user.isAdmin ? 'Admin' : 'User'}
										</Badge>
									</Stack>
								</Box>
							))}
						</Stack>
					</Box>
				</Box>
			)}
		</>
	);
};

export default UserListScreen;