import React, { useState } from 'react'
import { useDisclosure } from '@chakra-ui/hooks'
import { IconButton, Button } from '@chakra-ui/button'
import { ViewIcon } from '@chakra-ui/icons'
import { 
        Box,
        Text,
        Modal, 
        ModalBody, 
        ModalCloseButton, 
        ModalContent, 
        ModalFooter, 
        ModalHeader, 
        ModalOverlay, 
        useToast,
        FormControl,
        Input,
        Spinner} from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';


const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameloading] = useState(false);
    
    const { user, selectedChat, setSelectedChat } = ChatState();

    const toast = useToast();

    const handleRemove = async (user1) => {
         if (selectedChat.users.filter((del) =>  del._id !== user1._id)) {
            toast({
              title: "Only admins can remove someone!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
          }

          try {
            setLoading(true);
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
            const { data } = await axios.put(
              `/api/chat/groupremove`,
              {
                chatId: selectedChat._id,
                userId: user1._id,
              },
              config
            );
      
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
          } catch (error) {
            toast({
              title: "Error Occured!",
              description: error.response.data.message,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
          }
    };

    const handleRename = async () => {
        if (!groupChatName) return

        try {
            setRenameloading(true)

            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              };

            const { data } = await axios.put(
                `/api/chat/rename`, 
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                    config
                );

                setSelectedChat(data);
                setFetchAgain(!fetchAgain);
                setRenameloading(false);
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setRenameloading(false);
        }

        setGroupChatName("");

    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query){
            return;
        };

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            console.log(data);
            setLoading(false);
            setSearchResult(data); 
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: "Failed to Load the Search Results.",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: 'This User Already in Group!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top",
              });
              return;
        }
        // if (selectedChat.groupAdmin._id !== user._id) {
        //     toast({
        //         title: 'Only Admins can Add Someone to This Group!',
        //         status: 'error',
        //         duration: 5000,
        //         isClosable: true,
        //        position: "top",
        //       });
        //       return;
        // }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(`/api/chat/groupadd`, {
                chatId: selectedChat._id,
                userId: user1._id,
            },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setLoading(false);
        }

    };

    return (
        <>
          <IconButton display={{ base: "flex"}} icon={<ViewIcon />} onClick={onOpen} />
    
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                display="flex"
                fontSize="35px"
                fontFamily="Work sans"
                justifyContent="center"
                >
                    {selectedChat.chatName}
                </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                    <Text>Existing Members:</Text>
                    <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                        {selectedChat.users.map((u) => (
                                <UserBadgeItem
                                    key={(user._id)}
                                    user={u}
                                    handleFunction={() => handleRemove(u)}
                                />
                        ))}
                        </Box>
                        <Text>Rename Group Chat Name:</Text>
                        <FormControl display="flex">
                            <Input
                                placeholder="Group Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameloading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <Text>Add User to this group:</Text>
                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {loading ? (
                            <Spinner size="lg" />
                            ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}

              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='red' onClick={() => handleRemove(user)}>
                  Leave Group 
                </Button>
                
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )

}

export default UpdateGroupChatModal;