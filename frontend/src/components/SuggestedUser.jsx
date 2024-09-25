import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import usehandlefollowUnfollow from '../hooks/usehandlefollowUnfollow'

const SuggestedUser = ({user}) => {
   const {handleFollowAndUnfollow,updating,following}=usehandlefollowUnfollow(user)
  return (
    <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
    <Flex gap={2} as={Link} to={`${user.username}`}>
        <Avatar src={user.profilePic} />
        <Box>
            <Text fontSize={"sm"} fontWeight={"bold"}>
            {user.name}
            </Text>
            <Text color={"gray.light"} fontSize={"sm"}>
              {user.username}
            </Text>
        </Box>
    </Flex>
    <Button
        size={"sm"}
        color={following ? "black" : "white"}
        bg={following ? "white" : "blue.400"}
        onClick={handleFollowAndUnfollow}
        isLoading={updating}
        _hover={{
            color: following ? "black" : "white",
            opacity: ".8",
        }}
    >
        {following ? "Unfollow" : "Follow"}
    </Button>
</Flex>
  )
}

export default SuggestedUser