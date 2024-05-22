import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { FaUserAstronaut } from 'react-icons/fa'
import LogoutButton from './logoutButton'
import { LogOutIcon } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'

const UserButton = () => {
  const user = useCurrentUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ''}></AvatarImage>
          <AvatarFallback className="bg-indigo-800">
            <FaUserAstronaut className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <LogoutButton>
          <DropdownMenuItem>
            Sign-out
            <LogOutIcon className="h-4 w-4 ml-3" />
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton
