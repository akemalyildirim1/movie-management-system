import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators';
import { TokenPayload } from '../../common/interfaces';
import { CreateWatchDto } from './dto/create-watch.dto';
import { WatchHistoryDto } from './dto/watch-history.dto';
import { WatchService } from './watch.service';

@Controller('watch')
@ApiTags('watch')
@ApiBearerAuth()
export class WatchController {
  constructor(private readonly watchService: WatchService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Watch the selected movie.' })
  @ApiCreatedResponse({
    description: 'The movie has been successfully watched.',
  })
  async create(
    @CurrentUser() user: TokenPayload,
    @Body() createWatchDto: CreateWatchDto,
  ): Promise<void> {
    return this.watchService.create(user.userId, createWatchDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  @ApiOperation({ summary: 'Get the watch history of the user.' })
  @ApiOkResponse({
    description:
      'The watch history of the user has been successfully retrieved.',
    type: WatchHistoryDto,
    isArray: true,
  })
  async getWatchHistory(
    @CurrentUser() user: TokenPayload,
  ): Promise<WatchHistoryDto[]> {
    return this.watchService.getWatchHistory(user.userId);
  }
}
