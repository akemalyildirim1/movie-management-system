import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators';
import { TokenPayload } from '../../common/interfaces';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketDto } from './dto/ticket.dto';
import { TicketsService } from './tickets.service';

@Controller('tickets')
@ApiTags('tickets')
@ApiBearerAuth()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Buy a ticket.' })
  @ApiCreatedResponse({
    description: 'The ticket has been successfully purchased.',
  })
  async create(
    @Body() createTicketDto: CreateTicketDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<void> {
    await this.ticketsService.create(createTicketDto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all tickets of the user.' })
  @ApiOkResponse({
    description: 'All tickets of the user.',
    type: TicketDto,
    isArray: true,
  })
  async findAll(@CurrentUser() user: TokenPayload): Promise<TicketDto[]> {
    return this.ticketsService.findAll(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a ticket by id.' })
  @ApiOkResponse({
    description: 'The ticket.',
    type: TicketDto,
  })
  async findOne(
    @CurrentUser() user: TokenPayload,
    @Param('id') id: string,
  ): Promise<TicketDto> {
    return this.ticketsService.findOne(user.userId, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a ticket by id.' })
  @ApiNoContentResponse({
    description: 'The ticket has been successfully deleted.',
  })
  async remove(@CurrentUser() user: TokenPayload, @Param('id') id: string) {
    await this.ticketsService.remove(user.userId, +id);
  }
}
