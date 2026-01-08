import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CustomerSegmentService } from '../services/customer-segment.service';
import { CustomerSegmentAssignmentService } from '../services/customer-segment.service';
import { CustomerTagService } from '../services/customer-segment.service';
import { CustomerTagAssignmentService } from '../services/customer-segment.service';
import {
  CustomerSegmentResponseDto,
  CustomerSegmentAssignmentResponseDto,
  CustomerTagResponseDto,
  CustomerTagAssignmentResponseDto,
} from '../dto/customer-segment.dto';

@Controller('crm/segments')
export class CustomerSegmentController {
  constructor(
    private readonly customerSegmentService: CustomerSegmentService,
  ) {}

  @Get()
  async findAll(): Promise<CustomerSegmentResponseDto[]> {
    return await this.customerSegmentService.findAll();
  }

  @Get('active')
  async findActive(): Promise<CustomerSegmentResponseDto[]> {
    return await this.customerSegmentService.findActive();
  }

  @Get('code/:segmentCode')
  async findByCode(
    @Param('segmentCode') segmentCode: string,
  ): Promise<CustomerSegmentResponseDto> {
    return await this.customerSegmentService.findByCode(segmentCode);
  }

  @Get('uuid/:uuid')
  async findByUuid(
    @Param('uuid') uuid: string,
  ): Promise<CustomerSegmentResponseDto> {
    return await this.customerSegmentService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomerSegmentResponseDto> {
    return await this.customerSegmentService.findById(id);
  }
}

@Controller('crm/segment-assignments')
export class CustomerSegmentAssignmentController {
  constructor(
    private readonly customerSegmentAssignmentService: CustomerSegmentAssignmentService,
  ) {}

  @Get()
  async findAll(): Promise<CustomerSegmentAssignmentResponseDto[]> {
    return await this.customerSegmentAssignmentService.findAll();
  }

  @Get('customer/:customerId')
  async findByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<CustomerSegmentAssignmentResponseDto[]> {
    return await this.customerSegmentAssignmentService.findByCustomerId(
      customerId,
    );
  }

  @Get('customer/:customerId/active')
  async findByCustomerIdActive(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<CustomerSegmentAssignmentResponseDto[]> {
    return await this.customerSegmentAssignmentService.findByCustomerIdActive(
      customerId,
    );
  }

  @Get('segment/:segmentId')
  async findBySegmentId(
    @Param('segmentId', ParseIntPipe) segmentId: number,
  ): Promise<CustomerSegmentAssignmentResponseDto[]> {
    return await this.customerSegmentAssignmentService.findBySegmentId(
      segmentId,
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomerSegmentAssignmentResponseDto> {
    return await this.customerSegmentAssignmentService.findById(id);
  }
}

@Controller('crm/tags')
export class CustomerTagController {
  constructor(private readonly customerTagService: CustomerTagService) {}

  @Get()
  async findAll(): Promise<CustomerTagResponseDto[]> {
    return await this.customerTagService.findAll();
  }

  @Get('active')
  async findActive(): Promise<CustomerTagResponseDto[]> {
    return await this.customerTagService.findActive();
  }

  @Get('name/:tagName')
  async findByName(
    @Param('tagName') tagName: string,
  ): Promise<CustomerTagResponseDto> {
    return await this.customerTagService.findByName(tagName);
  }

  @Get('uuid/:uuid')
  async findByUuid(
    @Param('uuid') uuid: string,
  ): Promise<CustomerTagResponseDto> {
    return await this.customerTagService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomerTagResponseDto> {
    return await this.customerTagService.findById(id);
  }
}

@Controller('crm/tag-assignments')
export class CustomerTagAssignmentController {
  constructor(
    private readonly customerTagAssignmentService: CustomerTagAssignmentService,
  ) {}

  @Get()
  async findAll(): Promise<CustomerTagAssignmentResponseDto[]> {
    return await this.customerTagAssignmentService.findAll();
  }

  @Get('customer/:customerId')
  async findByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<CustomerTagAssignmentResponseDto[]> {
    return await this.customerTagAssignmentService.findByCustomerId(
      customerId,
    );
  }

  @Get('tag/:tagId')
  async findByTagId(
    @Param('tagId', ParseIntPipe) tagId: number,
  ): Promise<CustomerTagAssignmentResponseDto[]> {
    return await this.customerTagAssignmentService.findByTagId(tagId);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomerTagAssignmentResponseDto> {
    return await this.customerTagAssignmentService.findById(id);
  }
}
