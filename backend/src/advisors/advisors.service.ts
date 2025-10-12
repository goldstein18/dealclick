import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../properties/entities/property.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AdvisorsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  async findAll(filters: any) {
    const { estado, especialidad, empresa, search, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.role IN (:...roles)', { roles: ['agent', 'broker'] })
      .leftJoinAndSelect('user.properties', 'properties')
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (estado && estado !== 'Todos') {
      queryBuilder.andWhere('user.ubicacion = :estado', { estado });
    }

    if (especialidad && especialidad !== 'Todas') {
      queryBuilder.andWhere(':especialidad = ANY(user.specialties)', { especialidad });
    }

    if (empresa && empresa !== 'Todas') {
      queryBuilder.andWhere('user.company = :empresa', { empresa });
    }

    if (search) {
      queryBuilder.andWhere(
        '(user.name LIKE :search OR user.company LIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    // Add property count to each advisor
    const advisors = data.map(advisor => ({
      id: advisor.id,
      nombre: advisor.name,
      empresa: advisor.company,
      especialidad: advisor.specialties?.[0] || '',
      ubicacion: advisor.ubicacion,
      imagen: advisor.avatar,
      propiedades: advisor.properties?.length || 0,
    }));

    return {
      data: advisors,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['properties'],
    });

    if (!user) {
      throw new NotFoundException(`Advisor with ID ${id} not found`);
    }

    return {
      id: user.id,
      name: user.name,
      role: user.role,
      license: user.license,
      bio: user.bio,
      email: user.email,
      phone: user.phone,
      company: user.company,
      experience: user.experience,
      specialties: user.specialties,
      image: user.avatar,
      propertiesCount: user.properties?.length || 0,
    };
  }

  async getAdvisorProperties(id: string): Promise<Property[]> {
    return this.propertyRepository.find({
      where: { userId: id },
      order: { createdAt: 'DESC' },
    });
  }
}

