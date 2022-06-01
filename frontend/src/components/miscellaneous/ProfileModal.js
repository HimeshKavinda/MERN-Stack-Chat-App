import { useDisclosure } from '@chakra-ui/hooks';
import { IconButton, Button } from '@chakra-ui/button';
import React from 'react'
import { ViewIcon } from '@chakra-ui/icons';
import { Image, MenuItem, Text } from '@chakra-ui/react';
import { 
        Modal, 
        ModalBody, 
        ModalCloseButton, 
        ModalContent, 
        ModalFooter, 
        ModalHeader, 
        ModalOverlay } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';

const ProfileModal = ({ childern }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const { user } = ChatState();

  return (
    <>
      {childern ? (
        <span onClick={onOpen}>{childern}</span>
      ) : (
        <MenuItem>My Profile 
        <IconButton display={{ base: "flex"}} icon={<ViewIcon />} onClick={onOpen}/>
        </MenuItem>
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
            >
              {user.name}
            </ModalHeader>
          <ModalCloseButton />
          <ModalBody 
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            >
              <Image 
              borderRadius="full" 
              boxSize="150px"
              src={user.pic}
              alt={user.name}
              />
              <Text
                fontSize={{ base: "28px", md: "25px" }}
                fontFamily="Work sans"
              >
                Email: {user.email}
              </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;