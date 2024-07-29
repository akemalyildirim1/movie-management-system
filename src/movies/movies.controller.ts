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
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieDto } from './dto/movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
@ApiTags('movies')
@ApiBearerAuth()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Roles(UserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a movie.' })
  @ApiCreatedResponse({
    description: 'The movie has been successfully created.',
  })
  async create(@Body() createMovieDto: CreateMovieDto): Promise<void> {
    await this.moviesService.create(createMovieDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all movies.' })
  @ApiOkResponse({
    description: 'Return all movies.',
    type: MovieDto,
    isArray: true,
  })
  async findAll(): Promise<MovieDto[]> {
    return this.moviesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by id.' })
  @ApiOkResponse({
    description: 'Return a movie by id.',
    type: MovieDto,
  })
  async findOne(@Param('id') id: string): Promise<MovieDto> {
    return this.moviesService.findOne(+id);
  }

  @Roles(UserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update the selected movie.' })
  @ApiNoContentResponse({
    description: 'The movie has been successfully updated.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<void> {
    await this.moviesService.update(+id, updateMovieDto);
  }

  @Roles(UserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove the selected movie.' })
  @ApiNoContentResponse({
    description: 'The movie has been successfully removed.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.moviesService.remove(+id);
  }
}
