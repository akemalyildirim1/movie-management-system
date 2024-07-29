import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../common';
import { Roles } from '../common/decorators';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomDto, Rooms } from './dto/room.dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
@ApiTags('rooms')
@ApiBearerAuth()
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Roles(UserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new room' })
  @ApiCreatedResponse({
    description: 'The room has been successfully created.',
  })
  async create(@Body() createRoomDto: CreateRoomDto): Promise<void> {
    return this.roomsService.create(createRoomDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get information of all rooms.' })
  @ApiOkResponse({
    description: 'Rooms list',
    type: RoomDto,
    isArray: true,
  })
  async findAll(): Promise<Rooms> {
    return this.roomsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get information of the selected room.' })
  @ApiOkResponse({
    description: 'Room details',
    type: RoomDto,
  })
  async findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Roles(UserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update the selected room.' })
  @ApiNoContentResponse({
    description: 'The room has been successfully updated.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: CreateRoomDto,
  ): Promise<void> {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Roles(UserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete the selected room.' })
  @ApiNoContentResponse({
    description: 'The room has been successfully deleted.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.roomsService.remove(+id);
  }
}
