import { useDisclosure } from '@chakra-ui/hooks';
import { 
        Button,  
        FormLabel, 
        Modal, 
        ModalBody, 
        ModalCloseButton, 
        ModalContent, 
        ModalFooter, 
        ModalHeader, 
        ModalOverlay, 
        useToast} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Input } from '@chakra-ui/input';
import { ChatState } from '../../Context/ChatProvider';
import { FormControl } from '@chakra-ui/form-control';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import { Box } from '@chakra-ui/layout';


const GroupChatModal = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatname, setGroupChatname] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState();

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

    const handleSubmit = async () => {
        if (!groupChatname || !selectedUsers) {
            toast({
                title: "Please fill all the fields",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top",
              });
              return;
        }

        try {

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(`/api/chat/group`, 
            {
                name: groupChatname,
                users: JSON.stringify(selectedUsers.map((u) => u._id)), 
            },
            config
            );

            setChats([data, ...chats]);
                onClose();
                toast({
                    title: "New Group Chat Created!",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
        } catch (error) {
            toast({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }
    };

    const handleDelete = (deleteUser) => {
        setSelectedUsers(
            selectedUsers.filter((sel) => sel._id !== deleteUser._id)
        );
    };

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "This User Already Added!",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top",
              });
              return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    return (
        <>
          <span onClick={onOpen}>{children}</span>
    
          <Modal
            isOpen={isOpen}
            onClose={onClose}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                fontSize="35px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
              >
                  Create a Group Chat
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody display="flex" flexDir="column" alignItems="center">
                <FormControl>
                  <FormLabel fontFamily="Work sans" fontWeight="bold" textColor="blue">Chat Group Name</FormLabel>
                  <Input 
                    placeholder="Chat Group Name" 
                    mb={3} 
                    onChange={(e) => setGroupChatname(e.target.value)} 
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontFamily="Work sans" fontWeight="bold" textColor="blue">Search Members To Add</FormLabel>
                  <Input 
                    placeholder="Add Users eg: Kamal, Saman, Kumari" 
                    mb={1} 
                    onChange={(e) => handleSearch(e.target.value)} 
                  />
                </FormControl>
                    <Box w="100%" display="flex" flexWrap="wrap">
                        {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={(user._id)}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                        ))}
                    </Box>

                {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
                ) : (
                searchResult
                    ?.slice(0, 4)
                    .map((user) => (
                    <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                    />
                    ))
                )}
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' onClick={handleSubmit}>
                  Create Group
                </Button>
                &nbsp;
                <Button onClick={onClose} >Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default GroupChatModal;

